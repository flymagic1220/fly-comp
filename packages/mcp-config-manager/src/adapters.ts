import path from 'path';
export interface IdeAdapter {
  localDir: string | null; // 项目级相对路径，null表示不支持
  globalDir: string | null; // 全局相对用户主目录，null表示不支持
  configFile: string; // 配置文件名
  assetMappings?: Array<{ src: string; dest: string }>; // 资产映射：源路径（相对于 templates/{global|local}/assets/） -> 目标路径（相对于目标根目录）
}
export const IDE_ADAPTERS: Record<string, IdeAdapter> = {
  codebuddy: {
    localDir: '.codebuddy',
    globalDir: '.codebuddy',
    configFile: 'mcp.json',
    assetMappings: [
      { src: 'codebuddy/skills', dest: 'skills' },
      { src: 'codebuddy/rules', dest: 'rules' },
    ],
  },
  cursor: {
    localDir: '.cursor',
    globalDir: '.cursor',
    configFile: 'mcp.json',
    assetMappings: [
      // 如果未来有 cursor 专属规则，映射到这里
      // { src: 'cursor/rules', dest: 'rules' }
    ],
  },
  claude: {
    localDir: null,
    globalDir: path.join('Library', 'Application Support', 'Claude'),
    configFile: 'claude_desktop_config.json',
  },
  continue: {
    localDir: '.continue',
    globalDir: '.continue',
    configFile: 'config.json', // 注意 Continue 的格式特殊，后面需格式化
  },
  // 可继续扩展
};
