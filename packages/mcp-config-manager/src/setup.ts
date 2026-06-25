#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { IDE_ADAPTERS } from './adapters.js';
import { deepMerge } from './merger.js';
import { formatConfigForIde } from './formatters.js';
import { ensureDir, readJson, writeJson } from './utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');

function printHelp() {
  console.log(`
用法: mcp-setup [选项]

选项:
  --ide <name>       目标 IDE (默认: codebuddy)
                      支持: ${Object.keys(IDE_ADAPTERS).join(', ')}
  --global           全局安装，配置写入用户主目录 (默认: 项目级)
  --force            强制覆盖已有配置 (先删除再写入)
  --help             显示帮助信息

示例:
  mcp-setup                          # 项目级安装，写入 .codebuddy/
  mcp-setup --global                 # 全局安装，写入 ~/.codebuddy/
  mcp-setup --ide cursor             # 为 Cursor 安装项目级配置
  mcp-setup --ide claude --global    # 为 Claude Desktop 安装全局配置
  mcp-setup --global --force         # 强制覆盖全局配置
  `);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  let ide = 'codebuddy';
  let isGlobal = false;
  let isForce = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--ide' && i + 1 < args.length) {
      ide = args[i + 1]!;
      i++;
    } else if (args[i] === '--global') {
      isGlobal = true;
    } else if (args[i] === '--force') {
      isForce = true;
    }
  }

  const adapter = IDE_ADAPTERS[ide];
  if (!adapter) {
    console.error(`❌ 不支持的 IDE: ${ide}`);
    console.log(`支持的 IDE: ${Object.keys(IDE_ADAPTERS).join(', ')}`);
    process.exit(1);
  }

  // 确定目标目录
  let targetDir: string;
  if (isGlobal) {
    if (!adapter.globalDir) {
      console.error(`❌ ${ide} 不支持全局配置`);
      process.exit(1);
    }
    targetDir = path.join(os.homedir(), adapter.globalDir);
  } else {
    if (!adapter.localDir) {
      console.error(`❌ ${ide} 不支持项目级配置，请使用 --global`);
      process.exit(1);
    }
    targetDir = path.join(process.cwd(), adapter.localDir);
  }

  // 源模板目录（全局或项目级）
  const sourceDir = isGlobal
    ? path.join(packageRoot, 'templates', 'global')
    : path.join(packageRoot, 'templates', 'local');

  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ 模板目录不存在: ${sourceDir}`);
    process.exit(1);
  }

  // 如果是强制安装，先清理目标目录下的相关文件（仅清理配置文件，不删除用户其他文件）
  if (isForce && fs.existsSync(targetDir)) {
    // 清理配置文件（具体名称由 adapter.configFile 决定）
    const configPath = path.join(targetDir, adapter.configFile);
    if (fs.existsSync(configPath)) {
      fs.rmSync(configPath, { force: true });
      console.log(`🧹 已删除: ${configPath}`);
    }
    // 也可以清理 rules/skills 目录（可根据需要扩展）
  }

  // 开始合并
  ensureDir(targetDir);
  mergeDirectory(sourceDir, targetDir, ide, adapter);

  // 复制 IDE 专属资产（skills/rules 等），根据 isGlobal 选择全局/项目级资产
  copyAssets(targetDir, ide, isForce, isGlobal);

  console.log(`✅ MCP 配置已成功安装到: ${targetDir}`);
  console.log(`   IDE: ${ide}, 模式: ${isGlobal ? '全局' : '项目级'}`);
}

function mergeDirectory(src: string, dest: string, ide: string, adapter: any) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      // 跳过 assets/ 目录，资产由 copyAssets 单独处理
      if (entry.name === 'assets') continue;
      mergeDirectory(srcPath, destPath, ide, adapter);
    } else {
      // 如果是配置文件（mcp.json），进行合并
      if (entry.name === 'mcp.json') {
        mergeMcpJson(srcPath, dest, ide, adapter);
      } else {
        // 其他文件直接复制
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

function mergeMcpJson(srcPath: string, destDir: string, ide: string, adapter: any) {
  const configFileName = adapter.configFile;
  const destPath = path.join(destDir, configFileName);

  const source = readJson(srcPath);
  const target = readJson(destPath) || { mcpServers: {} };

  // 深度合并：target（用户已有配置）优先，source（模板）只补充缺失字段
  const merged = deepMerge(target, source);

  // 格式化（适配特定 IDE）
  const formatted = formatConfigForIde(ide, merged);

  writeJson(destPath, formatted);
}

function copyAssets(targetDir: string, ide: string, isForce: boolean, isGlobal: boolean) {
  const adapter = IDE_ADAPTERS[ide]!;
  if (!adapter.assetMappings) return;

  // 根据全局/项目级模式，选择对应的资产模板目录
  const scope = isGlobal ? 'global' : 'local';
  const assetsRoot = path.join(packageRoot, 'templates', scope, 'assets');
  for (const mapping of adapter.assetMappings) {
    const srcPath = path.join(assetsRoot, mapping.src);
    const destPath = path.join(targetDir, mapping.dest);
    if (fs.existsSync(srcPath)) {
      // force 模式：先清空目标目录再全量复制
      if (isForce && fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true });
        console.log(`🧹 已清理资产: ${destPath}`);
      }
      // 逐文件复制，已有文件不覆盖，保护用户自定义内容
      copyAssetsRecursive(srcPath, destPath, isForce);
      console.log(`📁 已同步资产: ${mapping.src} -> ${destPath}`);
    }
  }
}

/**
 * 递归复制资产文件。
 * - 默认模式：目标文件已存在则跳过，保护用户自定义内容。
 * - force 模式：目标文件已存在则覆盖，用于团队统一更新。
 */
function copyAssetsRecursive(src: string, dest: string, isForce: boolean) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      copyAssetsRecursive(
        path.join(src, entry.name),
        path.join(dest, entry.name),
        isForce,
      );
    }
  } else {
    if (isForce || !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  }
}

// 执行
main();
