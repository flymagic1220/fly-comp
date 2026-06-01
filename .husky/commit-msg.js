import { execSync } from 'node:child_process';
const [commitMsgFile] = process.argv.slice(2);
if (!commitMsgFile) {
  console.error('❌ Commit message file not provided');
  process.exit(1);
}

// 读取提交信息
const commitMsg = readFileSync(commitMsgFile, 'utf-8').trim();

// 特殊处理：RELEASING 开头的提交跳过校验（用于 changesets 自动发布）
if (commitMsg.startsWith('RELEASING')) {
  console.log('⚠️  Skipping commitlint for RELEASING commit');
  process.exit(0);
}
try {
  execSync(`pnpm commitlint --edit ${commitMsgFile}`, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}


