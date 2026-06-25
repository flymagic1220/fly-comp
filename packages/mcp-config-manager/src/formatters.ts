/**
 * 将标准 MCP 配置格式化为目标 IDE 所需的格式。
 *
 * 大部分 IDE（codebuddy/cursor/continue）直接使用标准 { mcpServers: {...} }，
 * Claude Desktop 使用顶层结构。若未来有 IDE 需要嵌套/包装格式，在此扩展。
 *
 * @param ide 目标 IDE 名称
 * @param mcpConfig 标准 MCP 配置对象 { mcpServers: {...} }
 * @returns 格式化后的配置对象
 */
export function formatConfigForIde(_ide: string, mcpConfig: any): any {
  // 当前所有支持的 IDE 均直接使用标准结构，无需转换
  return mcpConfig;
}
