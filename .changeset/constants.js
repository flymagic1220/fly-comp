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

export { commitTypeMap, commitTypeArr };