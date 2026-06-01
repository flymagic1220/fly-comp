
import fs from 'node:fs';
import path from 'node:path';

// 定义所有合法的 type（也可从外部文件导入）,后续会放入单独的文件中
const commitTypeMap = {
    feat: '✨ 新增功能',
    fix: '🐛 修复bug',
    style: '💄 样式调整',
    refactor: '♻️ 代码重构',
    perf: '⚡ 性能优化',
    chore: '💭 其他修改',
    test: '✅ 测试',
    build: '📦️ 构建',
    docs: '📝 文档、注释修改',
  };
  
  const commitTypeArr = Object.keys(commitTypeMap);
  
//   export { commitTypeMap, commitTypeArr };

// 动态扫描目录，生成合法的 scope 列表
const getScopes =()=>{
   const scopes = ['root']; // root 表示根目录级别变更
  
  // 扫描 apps 目录（如果有）
  const appsDir = path.join(process.cwd(), 'apps');
  if (fs.existsSync(appsDir)) {
    const apps = fs.readdirSync(appsDir).filter(f => 
      fs.statSync(path.join(appsDir, f)).isDirectory()
    );
    scopes.push(...apps);
  }
  
  // 扫描 packages 目录（如果有）
  const packagesDir = path.join(process.cwd(), 'packages');
  if (fs.existsSync(packagesDir)) {
    const packages = fs.readdirSync(packagesDir).filter(f => 
      fs.statSync(path.join(packagesDir, f)).isDirectory()
    );
    scopes.push(...packages);
  }
  
  return scopes;
}

export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
      // type 必须是预定义列表中的一个
      'type-enum': [2, 'always', commitTypeArr],
      // scope 必须来自动态扫描的目录
      'scope-enum': [2, 'always', getScopes()],
      // scope 不能为空
      'scope-empty': [2, 'never'],
      // scope 必须小写或 kebab-case
      'scope-case': [2, 'always', ['lowerCase', 'kebab-case']],
      // subject 不能为空
      'subject-empty': [2, 'never'],
    },
    // 忽略特定提交（如 changeset 自动生成的）
    ignores: [(commit) => commit.startsWith('RELEASING')],
  };
