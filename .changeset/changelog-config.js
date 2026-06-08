import { execSync } from 'node:child_process';
import dayjs from 'dayjs';
import { commitTypeMap, commitTypeArr } from './constants.js';

/**
 * 从包名提取目录路径
 * '@fly/components' -> 'components'
 * 'components' -> 'components'
 */
const getPackagePath = (packageName) => {
  return packageName.split('/').pop();
};

/**
 * 获取指定包的最新 tag
 */
const getLatestTagForPackage = (packageName) => {
  try {
    const command = `git tag --list "${packageName}@*" | sed 's/.*@//' | sort -V | tail -n1 | xargs -I {} echo "${packageName}@{}"`;
    let tag = execSync(command, { encoding: 'utf-8' }).trim();
    
    if (!tag) {
      const fallbackCommand = `git tag --list "${packageName}@*" | tail -n1`;
      tag = execSync(fallbackCommand, { encoding: 'utf-8' }).trim();
    }
    
    if (tag) {
      console.log(`✅ 找到 ${packageName} 的最新 tag: ${tag}`);
      return tag;
    }
    
    console.log(`⚠️  未找到 ${packageName} 的 tag`);
    return '';
  } catch (error) {
    return '';
  }
};

/**
 * 获取 base tag（多层降级）
 */
const getBaseTag = (packageName) => {
  // 降级1：该包专属 tag
  const packageTag = getLatestTagForPackage(packageName);
  if (packageTag) return packageTag;
  
  // 降级2：全局初始 tag
  try {
    const initTag = execSync('git tag --list "v0.0.0*" | head -1', { encoding: 'utf-8' }).trim();
    if (initTag) return initTag;
  } catch {}
  
  // 降级3：返回空字符串（首次发布）
  console.log(`📦 ${packageName} 首次发布`);
  return '';
};

const getCommitType = (commitMessage) => {
  const [type] = commitMessage.split(':');
  return type.replace(/\(.*\)/, '');
};

const getGitCommitLog = (packageName) => {
  const packagePath = getPackagePath(packageName);
  const latestTag = getBaseTag(packageName);
  const range = latestTag ? `${latestTag}..` : '';
  const command = `git log --pretty=format:"%s | <code>%an</code>" ${range}packages/${packagePath}`;
  
  console.log(`📝 ${command}`);
  
  try {
    const logs = execSync(command, { encoding: 'utf-8' });
    
    if (!logs.trim()) {
      return latestTag ? '无新增变更记录  \n' : '首次发布版本  \n';
    }
    
    const formatLogs = logs.split('\n').filter((item) => {
      return commitTypeArr.includes(getCommitType(item));
    });
    
    if (formatLogs.length === 0) {
      return latestTag ? '无可记录的变更  \n' : '首次发布版本  \n';
    }
    
    const typeMap = new Map();
    formatLogs.forEach((item) => {
      const message = item.split(':').slice(1).join(':').replace(/\|.*$/, '').trim();
      const type = getCommitType(item);
      
      if (typeMap.has(type)) {
        typeMap.get(type).push(message);
      } else {
        typeMap.set(type, [message]);
      }
    });
    
    let logString = `<code>${dayjs().format('YYYY-MM-DD HH:mm:ss')}</code>  \n`;
    typeMap.forEach((value, key) => {
      if (commitTypeMap[key]) {
        logString += `### ${key}（${commitTypeMap[key]}）\n\n`;
        value.forEach((item) => {
          logString += `- ${item}\n`;
        });
      }
    });
    
    return logString;
  } catch (error) {
    console.error(`获取失败:`, error.message);
    return '获取变更记录失败  \n';
  }
};

let releaseCount = 0;

export async function getReleaseLine(changeset, type, changelogOpts) {
  const current = changeset.releases[releaseCount++];
  const packageName = current.name;
  console.log(`\n🔍 生成 ${packageName} 的 Changelog...`);
  return getGitCommitLog(packageName);
}

export async function getDependencyReleaseLine(changesets, dependenciesUpdated, changelogOpts) {
  if (dependenciesUpdated.length === 0) return '';
  const depLines = dependenciesUpdated.map((d) => `- 更新 \`${d.name}\` 到 \`${d.newVersion}\``);
  return `\n### 依赖更新\n${depLines.join('\n')}\n`;
}

export default {
  getReleaseLine,
  getDependencyReleaseLine
};