/**
 * 判断字符串是否为占位符（如 <YOUR_API_KEY>）
 * @param str
 * @returns
 */
export function isPlaceholder(str: string): boolean {
  return /^<[^>]+>$/.test(str) && str.includes('YOUR_');
}
/**
 * 深度合并两个对象，base 优先，overlay 补充缺失字段。
 *
 * 合并策略：
 * - base 中已有的字段保留（用户配置优先）
 * - overlay 中 base 不存在的字段才写入（模板只补缺）
 * - 占位符保护：overlay 中的 `<YOUR_*>` 占位符不会被写入 base
 * - 对象嵌套时递归合并
 * - 数组合并采用按索引逐元素递归，适用于顺序固定的小列表
 *
 * TODO: 如果未来出现以下场景，需调整合并策略：
 *   - 数组元素需要按 id/key 匹配而非按索引（如 allowedTools 列表可增删改）
 *     方案：增加 idKey 参数，按指定字段做元素级 diff
 *   - 需要支持多种占位符格式（如 {{VAR}}、$VAR）
 *     方案：isPlaceholder 改为可配置的正则或回调
 *
 * @param base 基础对象（用户本地已有配置，优先保留）
 * @param overlay 覆盖层对象（团队模板，只补充 base 中不存在的字段）
 * @returns 合并后的对象
 */
export function deepMerge(base: any, overlay: any): any {
  if (overlay === null || typeof overlay !== 'object') return overlay;

  // 数组合并：按索引逐元素递归。当前 MCP 配置中不涉及数组结构，
  // 若未来需按 id 匹配合并，请参考上方的 TODO。
  if (Array.isArray(overlay)) {
    if (!Array.isArray(base)) return overlay;
    const maxLen = Math.max(base.length, overlay.length);
    const result = [];
    for (let i = 0; i < maxLen; i++) {
      result.push(deepMerge(base[i], overlay[i]));
    }
    return result;
  }

  // base 优先：以 base 为底，overlay 只补充缺失字段
  const output = { ...overlay };
  for (const key in base) {
    if (Object.prototype.hasOwnProperty.call(base, key)) {
      const baseVal = base[key];
      const overlayVal = overlay[key];
      // 保护占位符：overlay 中是占位符则跳过，保留 base 中的真实值
      if (
        typeof overlayVal === 'string' &&
        isPlaceholder(overlayVal) &&
        typeof baseVal === 'string' &&
        !isPlaceholder(baseVal)
      ) {
        output[key] = baseVal;
        continue;
      }
      if (baseVal && typeof baseVal === 'object' && overlayVal && typeof overlayVal === 'object') {
        output[key] = deepMerge(baseVal, overlayVal);
      } else {
        // base 优先：base 中的值直接覆盖 overlay
        output[key] = baseVal;
      }
    }
  }
  return output;
}
