import chalk from 'chalk';

console.log(
  chalk.green(
    '发布成功后，请前往 ' +
      chalk.yellow.underline('github') +
      ' 仓库提交 ' +
      chalk.yellow.underline('develop') +
      ' 分支到 ' +
      chalk.yellow.underline('master') +
      ' 的合并请求。'
  )
);

console.log(
  chalk.green('git仓库地址：') +
    chalk.blue.underline('http://xxxx')
);

console.log(chalk.green('代码合并后，会基于 master 分支自动触发文档项目的构建部署任务。'));
