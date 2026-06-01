import path from 'path';
import fs from 'fs';

/** ESLint 配置文件可能的后缀 */
const ESLINT_CONFIG_SUFFIXES = ['.ts', '.mjs', '.js', '.cjs'];

/**
 * 在指定目录查找 ESLint 配置文件，返回第一个匹配的路径
 */
function findEslintConfig(dir) {
  for (const suffix of ESLINT_CONFIG_SUFFIXES) {
    const configPath = path.join(dir, `eslint.config${suffix}`);
    if (fs.existsSync(configPath)) return configPath;
  }
  return null;
}

/** 项目根目录 */
const ROOT_DIR = path.resolve(import.meta.dirname);

export default {
  '*.{json,md,html,css,scss,less,vue}': ['prettier --ignore-unknown --write'],
  '*.{css,scss,less,vue}':['stylelint --fix'],
  '*.{js,jsx,ts,tsx,vue}': (stagedFiles) => {
    const filesMap = new Map();

    stagedFiles.forEach((file) => {
      const filePath = path.resolve(file);
      let currentDir = path.dirname(filePath);
      let matched = false;

      while (currentDir !== path.resolve('/')) {
        const pckPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(pckPath)) {
          const configPath = findEslintConfig(currentDir);
          if (configPath) {
            if (filesMap.has(currentDir)) {
              filesMap.get(currentDir).push(file);
            } else {
              filesMap.set(currentDir, [file]);
            }
            matched = true;
          }
          // 找到 package.json 就停止，不再继续向上
          break;
        }
        currentDir = path.dirname(currentDir);
      }

      // 子包有 package.json 但没有 eslint 配置，fallback 到根目录配置
      if (!matched && findEslintConfig(ROOT_DIR)) {
        if (filesMap.has(ROOT_DIR)) {
          filesMap.get(ROOT_DIR).push(file);
        } else {
          filesMap.set(ROOT_DIR, [file]);
        }
      }
    });

    const commands = [];
    filesMap.forEach((files, dir) => {
      const configPath = findEslintConfig(dir);
      commands.push(`eslint --fix --config ${configPath} ${files.join(' ')}`);
    });

    return commands;
  },
};
