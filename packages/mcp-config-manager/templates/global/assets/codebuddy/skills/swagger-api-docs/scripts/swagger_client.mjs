#!/usr/bin/env node
/**
 * Swagger / OpenAPI 接口文档获取工具 (Node.js 版)
 *
 * 零依赖，仅使用 Node.js 内置模块。
 * 支持 OpenAPI 2.0 (Swagger) 和 3.0/3.1 格式。
 *
 * 使用方法:
 *   # 从 URL 获取 API 文档
 *   node swagger_client.mjs fetch --url "http://192.168.1.1:8080/v2/api-docs"
 *
 *   # 从本地文件解析
 *   node swagger_client.mjs parse --file ./swagger.json
 *
 *   # 列出所有接口路径
 *   node swagger_client.mjs list --url "http://192.168.1.1:8080/v2/api-docs"
 *
 *   # 按标签/分组筛选接口
 *   node swagger_client.mjs list --url "http://192.168.1.1:8080/v2/api-docs" --tag "用户管理"
 *
 *   # 按关键词搜索接口
 *   node swagger_client.mjs search --url "http://192.168.1.1:8080/v2/api-docs" --query "登录"
 *
 *   # 获取单个接口的详细信息
 *   node swagger_client.mjs detail --url "http://192.168.1.1:8080/v2/api-docs" --path "/api/user/login" --method post
 *
 *   # Knife4j 网关: 列出所有微服务
 *   node swagger_client.mjs services --gateway "http://host:port"
 *
 *   # Knife4j 网关: 列出微服务及接口统计
 *   node swagger_client.mjs services --gateway "http://host:port" --detail
 *
 *   # 列出单个服务的所有标签分组
 *   node swagger_client.mjs tags --url "http://host:port/service/v3/api-docs?group=restApi"
 *
 *   # 跨服务搜索标签（快速定位接口所在服务）
 *   node swagger_client.mjs search-tags --gateway "http://host:port" --query "审批"
 */

import { readFileSync, existsSync } from 'fs';

// ---------------------------------------------------------------------------
// OpenAPI 文档获取
// ---------------------------------------------------------------------------

/** 从 URL 获取 Swagger JSON */
async function fetchDoc(url, { username, password, token } = {}) {
  const headers = { 'Accept': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (username && password) {
    const encoded = Buffer.from(`${username}:${password}`).toString('base64');
    headers['Authorization'] = `Basic ${encoded}`;
  }

  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    throw new Error(`请求失败: HTTP ${resp.status} ${resp.statusText}`);
  }
  return resp.json();
}

/** 从本地文件读取 Swagger JSON/YAML */
function loadDoc(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// ---------------------------------------------------------------------------
// 解析器
// ---------------------------------------------------------------------------

/** 解析 OpenAPI 文档，统一为内部结构 */
class SwaggerParser {
  constructor(doc) {
    this.doc = doc;
    this.isOAS3 = !!(doc.openapi || doc.asyncapi);
  }

  /** 获取文档基本信息 */
  getInfo() {
    const info = this.doc.info || {};
    return {
      标题: info.title || '未命名',
      版本: info.version || '未知',
      描述: info.description || '',
      服务地址: this.isOAS3
        ? (this.doc.servers || []).map(s => s.url).join(', ')
        : `${this.doc.schemes?.[0] || 'http'}://${this.doc.host || ''}${this.doc.basePath || ''}`,
      API版本: this.isOAS3 ? (this.doc.openapi || '3.x') : (this.doc.swagger || '2.0'),
    };
  }

  /** 获取所有标签/分组 */
  getTags() {
    const tags = this.doc.tags || [];
    return tags.map(t => ({ 名称: t.name, 描述: t.description || '' }));
  }

  /** 获取所有接口路径 */
  getPaths() {
    const paths = this.doc.paths || {};
    const result = [];

    for (const [path, methods] of Object.entries(paths)) {
      if (!methods) continue;
      for (const [method, detail] of Object.entries(methods)) {
        if (!detail || typeof detail !== 'object') continue;
        if (['parameters', '$ref'].includes(method)) continue;

        result.push({
          路径: path,
          方法: method.toUpperCase(),
          摘要: detail.summary || '',
          描述: detail.description || '',
          标签: detail.tags || [],
          操作ID: detail.operationId || '',
          参数: this._parseParams(detail.parameters, path, method),
          请求体: this._parseRequestBody(detail),
          响应: this._parseResponses(detail.responses || {}),
        });
      }
    }

    return result;
  }

  /** 解析参数 */
  _parseParams(parameters, path, method) {
    if (!parameters || parameters.length === 0) return [];

    return parameters.map(p => {
      // 处理 $ref 引用
      if (p.$ref) {
        const refName = p.$ref.split('/').pop();
        const resolved = this._resolveRef(p.$ref);
        return resolved ? { ...resolved, 名称: refName } : { 名称: refName };
      }

      const schema = p.schema || {};
      return {
        名称: p.name,
        位置: p.in,
        描述: p.description || '',
        必填: p.required || false,
        类型: schema.type || p.type || 'string',
        格式: schema.format || '',
        示例: schema.example || p.example || '',
        默认值: schema.default ?? '',
        枚举: schema.enum || p.enum || [],
      };
    });
  }

  /** 解析请求体 */
  _parseRequestBody(detail) {
    if (this.isOAS3) {
      const body = detail.requestBody;
      if (!body) return null;
      const jsonContent = (body.content || {})['application/json'] || {};
      let schema = jsonContent.schema || {};
      // 处理 $ref 引用
      if (schema.$ref) {
        schema = this._resolveRef(schema.$ref) || schema;
      }
      return {
        描述: body.description || '',
        必填: body.required !== false,
        类型: schema.type || 'object',
        属性: this._parseSchemaProperties(schema),
      };
    } else {
      // Swagger 2.0
      const bodyParam = (detail.parameters || []).find(p => p.in === 'body');
      if (!bodyParam) return null;
      const schema = bodyParam.schema || {};
      return {
        描述: bodyParam.description || '',
        必填: bodyParam.required || false,
        类型: schema.type || 'object',
        属性: this._parseSchemaProperties(schema),
      };
    }
  }

  /** 解析响应 */
  _parseResponses(responses) {
    const result = [];
    for (const [code, resp] of Object.entries(responses)) {
      const schema = (resp.schema || resp.content?.['application/json']?.schema || resp.content?.['*/*']?.schema || {});
      result.push({
        状态码: code,
        描述: resp.description || '',
        类型: schema.type || '',
        属性: code.startsWith('2') ? this._parseSchemaProperties(schema) : [],
      });
    }
    return result;
  }

  /** 递归解析 schema 属性 */
  _parseSchemaProperties(schema, depth = 0, maxDepth = 5) {
    if (!schema || depth > maxDepth) return [];

    // 数组类型
    if (schema.type === 'array' && schema.items) {
      let items = schema.items;
      if (items.$ref) {
        const resolved = this._resolveRef(items.$ref);
        if (resolved) items = resolved;
      }
      const childItems = this._parseSchemaProperties(items, depth + 1, maxDepth);
      return [{ 名称: '[数组元素]', 类型: items.type || 'object', 描述: items.description || '', 子属性: childItems }];
    }

    const props = schema.properties || {};
    const required = schema.required || [];
    const result = [];

    for (const [name, prop] of Object.entries(props)) {
      const item = {
        名称: name,
        类型: prop.type || '',
        描述: prop.description || '',
        必填: required.includes(name),
        格式: prop.format || '',
        示例: prop.example ?? '',
        默认值: prop.default ?? '',
        枚举: prop.enum || [],
      };

      // 嵌套对象
      if (prop.type === 'object' || prop.properties) {
        item.子属性 = this._parseSchemaProperties(prop, depth + 1, maxDepth);
      }

      // 嵌套数组
      if (prop.type === 'array' && prop.items) {
        let items = prop.items;
        // 解析 items 中的 $ref
        if (items.$ref) {
          const resolved = this._resolveRef(items.$ref);
          if (resolved) items = resolved;
        }
        item.子属性 = this._parseSchemaProperties(items, depth + 1, maxDepth);
      }

      // $ref 引用
      if (prop.$ref) {
        const resolved = this._resolveRef(prop.$ref);
        if (resolved) {
          item.类型 = resolved.type || item.类型;
          item.描述 = resolved.description || item.描述;
          item.子属性 = this._parseSchemaProperties(resolved, depth + 1, maxDepth);
        }
      }

      result.push(item);
    }

    return result;
  }

  /** 解析 $ref 引用 */
  _resolveRef(ref) {
    const parts = ref.replace('#/', '').split('/');
    let current = this.doc;
    for (const part of parts) {
      if (current && typeof current === 'object') {
        current = current[part];
      } else {
        return null;
      }
    }
    return current;
  }
}

// ---------------------------------------------------------------------------
// 格式化输出
// ---------------------------------------------------------------------------

/** 格式化为 Markdown */
function toMarkdown(parser) {
  const info = parser.getInfo();
  const tags = parser.getTags();
  const paths = parser.getPaths();

  let md = `# ${info.标题} - API 接口文档\n\n`;
  md += `**版本:** ${info.版本}  |  **API 版本:** ${info.API版本}  |  **服务地址:** ${info.服务地址}\n\n`;
  if (info.描述) md += `${info.描述}\n\n`;

  // 按标签分组
  const tagMap = new Map();
  tagMap.set('其他', []);

  for (const tag of tags) {
    tagMap.set(tag.名称, []);
  }

  for (const p of paths) {
    const tag = p.标签[0] || '其他';
    if (!tagMap.has(tag)) {
      tagMap.set(tag, []);
    }
    tagMap.get(tag).push(p);
  }

  // 生成目录
  md += `## 目录\n\n`;
  md += `共 **${paths.length}** 个接口，**${tagMap.size}** 个分组\n\n`;
  for (const [tag, items] of tagMap) {
    if (items.length === 0) continue;
    md += `- **${tag}** (${items.length} 个接口)\n`;
    for (const item of items) {
      md += `  - [${item.方法} ${item.路径}](#${item.操作ID || item.路径.replace(/[\/{}]/g, '-')})\n`;
    }
  }

  // 详细接口文档
  for (const [tag, items] of tagMap) {
    if (items.length === 0) continue;
    md += `\n---\n\n## ${tag}\n\n`;

    for (const item of items) {
      const anchor = item.操作ID || item.路径.replace(/[\/{}]/g, '-');
      md += `### ${item.方法} ${item.路径}\n\n`;
      if (item.摘要) md += `**${item.摘要}**\n\n`;
      if (item.描述) md += `${item.描述}\n\n`;

      // 请求参数
      if (item.参数.length > 0) {
        md += `**请求参数:**\n\n`;
        md += `| 名称 | 位置 | 类型 | 必填 | 描述 |\n`;
        md += `|------|------|------|------|------|\n`;
        for (const p of item.参数) {
          md += `| ${p.名称} | ${p.位置} | ${p.类型}${p.格式 ? `(${p.格式})` : ''} | ${p.必填 ? '是' : '否'} | ${p.描述} |\n`;
        }
        md += `\n`;
      }

      // 请求体
      if (item.请求体) {
        md += `**请求体:** ${item.请求体.必填 ? '(必填)' : '(可选)'}\n\n`;
        if (item.请求体.描述) md += `${item.请求体.描述}\n\n`;
        md += formatSchemaTable(item.请求体.属性, 0);
      }

      // 响应
      if (item.响应.length > 0) {
        md += `**响应:**\n\n`;
        for (const resp of item.响应) {
          md += `- **${resp.状态码}** ${resp.描述}\n`;
          if (resp.属性.length > 0) {
            md += formatSchemaTable(resp.属性, 2);
          }
        }
      }

      md += `---\n\n`;
    }
  }

  return md;
}

/** 格式化 schema 属性表格 */
function formatSchemaTable(properties, indentLevel) {
  if (!properties || properties.length === 0) return '';

  const indent = '  '.repeat(indentLevel);
  let table = `${indent}| 名称 | 类型 | 必填 | 描述 |\n`;
  table += `${indent}|------|------|------|------|\n`;

  for (const prop of properties) {
    const required = prop.必填 ? '是' : '否';
    table += `${indent}| ${prop.名称} | ${prop.类型}${prop.格式 ? `(${prop.格式})` : ''} | ${required} | ${prop.描述} |\n`;

    if (prop.子属性 && prop.子属性.length > 0) {
      for (const child of prop.子属性) {
        const childRequired = child.必填 ? '是' : '否';
        table += `${indent}|  └ ${child.名称} | ${child.类型}${child.格式 ? `(${child.格式})` : ''} | ${childRequired} | ${child.描述} |\n`;
      }
    }
  }

  table += '\n';
  return table;
}

/** 格式化为简洁列表 */
function toList(parser, { tag } = {}) {
  let paths = parser.getPaths();
  if (tag) {
    paths = paths.filter(p => p.标签.includes(tag));
  }

  const info = parser.getInfo();
  let output = `# ${info.标题} - 接口列表\n\n`;
  output += `**服务地址:** ${info.服务地址}  |  **共 ${paths.length} 个接口**\n\n`;

  // 按标签分组
  const grouped = new Map();
  for (const p of paths) {
    const t = p.标签[0] || '其他';
    if (!grouped.has(t)) grouped.set(t, []);
    grouped.get(t).push(p);
  }

  for (const [tag, items] of grouped) {
    output += `## ${tag} (${items.length})\n\n`;
    output += `| 方法 | 路径 | 摘要 |\n`;
    output += `|------|------|------|\n`;
    for (const item of items) {
      output += `| ${item.方法} | ${item.路径} | ${item.摘要} |\n`;
    }
    output += `\n`;
  }

  return output;
}

// ---------------------------------------------------------------------------
// Knife4j 网关支持
// ---------------------------------------------------------------------------

/** 从 Knife4j 网关获取微服务列表 */
async function fetchServicesList(gatewayUrl) {
  const url = gatewayUrl.replace(/\/$/, '') + '/swagger-resources';
  const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!resp.ok) {
    throw new Error(`获取服务列表失败: HTTP ${resp.status}，请确认网关地址正确（如 http://host:port）`);
  }
  const data = await resp.json();
  if (!Array.isArray(data)) {
    throw new Error(`服务列表格式异常，请确认这是一个 Knife4j 网关地址`);
  }
  return data;
}

/** services 命令: 列出网关下所有微服务 */
async function toServicesOutput(gatewayUrl, { detail, filter, group } = {}) {
  const services = await fetchServicesList(gatewayUrl);

  let filtered = services;
  if (group) {
    filtered = services.filter(s => s.url.includes(group) || s.name.includes(group));
  }
  if (filter) {
    const q = filter.toLowerCase();
    filtered = services.filter(s => s.name.toLowerCase().includes(q));
  }

  let output = `# 微服务列表\n\n`;
  output += `**网关地址:** ${gatewayUrl}  |  **共 ${filtered.length} 个服务**\n\n`;
  output += `| 服务名称 | 分组 | API 文档地址 |\n`;
  output += `|----------|------|-------------|\n`;

  for (const s of filtered) {
    const groupName = s.url.includes('cloudApi') ? 'cloudApi' : 'restApi';
    output += `| ${s.name} | ${groupName} | \`${s.url}\` |\n`;
  }

  // 并发获取接口统计
  if (detail) {
    output += `\n## 接口统计\n\n`;
    output += `| 服务名称 | 接口数 | 状态 |\n`;
    output += `|----------|--------|------|\n`;

    const results = await Promise.allSettled(
      filtered.map(async (s) => {
        const url = gatewayUrl.replace(/\/$/, '') + s.url;
        const doc = await fetchDoc(url);
        // count unique paths (each path may have multiple methods)
        const pathCount = Object.keys(doc.paths || {}).length;
        let apiCount = 0;
        for (const methods of Object.values(doc.paths || {})) {
          if (methods && typeof methods === 'object') {
            apiCount += Object.keys(methods).filter(k => !['parameters', '$ref'].includes(k)).length;
          }
        }
        return { name: s.name, apis: apiCount, paths: pathCount };
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled') {
        output += `| ${r.value.name} | ${r.value.apis} | ✅ |\n`;
      } else {
        output += `| ? | ? | ❌ 获取失败 |\n`;
      }
    }
  }

  return output;
}

/** tags 命令: 列出单个服务的所有标签分组及接口数 */
async function toTagsOutput(url, auth) {
  const doc = await fetchDoc(url, auth);
  const parser = new SwaggerParser(doc);
  const tags = parser.getTags();
  const paths = parser.getPaths();

  // 统计每个 tag 下的接口数
  const tagCounts = new Map();
  for (const t of tags) {
    tagCounts.set(t.名称, 0);
  }
  // 也统计未在顶层 tags 定义中出现过的标签
  const untagged = new Set();
  for (const p of paths) {
    const tag = p.标签[0] || '其他';
    if (!tagCounts.has(tag)) {
      untagged.add(tag);
    }
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  }

  // 将未定义的 tag 也加入输出
  for (const t of untagged) {
    if (!tags.find(x => x.名称 === t)) {
      tags.push({ 名称: t, 描述: '' });
    }
  }

  let output = `# ${parser.getInfo().标题} - 标签分组\n\n`;
  output += `**共 ${tags.length} 个分组，${paths.length} 个接口**\n\n`;
  output += `| 标签 | 接口数 | 描述 |\n`;
  output += `|------|--------|------|\n`;
  for (const t of tags) {
    output += `| ${t.名称} | ${tagCounts.get(t.名称) || 0} | ${t.描述 || '-'} |\n`;
  }

  return output;
}

/** search-tags 命令: 跨所有 restApi 服务搜索标签（快速定位） */
async function toSearchTagsOutput(gatewayUrl, query, { group, filter, auth } = {}) {
  const services = await fetchServicesList(gatewayUrl);

  // 默认只搜索 restApi（前端接口）
  let targetServices;
  if (group) {
    targetServices = services.filter(s => s.url.includes(group) || s.name.includes(group));
  } else if (filter) {
    const q = filter.toLowerCase();
    targetServices = services.filter(s => s.name.toLowerCase().includes(q));
  } else {
    targetServices = services.filter(s => s.url.includes('restApi'));
  }

  const q = query.toLowerCase();
  const results = [];

  // 并发获取所有目标服务的 tags
  const promises = targetServices.map(async (s) => {
    try {
      const url = gatewayUrl.replace(/\/$/, '') + s.url;
      const doc = await fetchDoc(url, auth);
      const tags = (doc.tags || []).filter(t => t.name.toLowerCase().includes(q));

      if (tags.length > 0) {
        // 统计每个匹配 tag 的接口数
        const paths = doc.paths || {};
        const tagCounts = new Map();
        for (const t of tags) {
          tagCounts.set(t.name, 0);
        }
        for (const methods of Object.values(paths)) {
          if (!methods || typeof methods !== 'object') continue;
          for (const [method, detail] of Object.entries(methods)) {
            if (['parameters', '$ref'].includes(method)) continue;
            if (detail && detail.tags) {
              for (const t of detail.tags) {
                if (tagCounts.has(t)) {
                  tagCounts.set(t, tagCounts.get(t) + 1);
                }
              }
            }
          }
        }
        return tags.map(t => ({
          服务: s.name,
          标签: t.name,
          描述: t.description || '',
          接口数: tagCounts.get(t.name) || 0,
          文档地址: s.url,
        }));
      }
    } catch {
      // 单个服务获取失败不影响整体
    }
    return [];
  });

  const allResults = (await Promise.all(promises)).flat();

  let output = `# 标签搜索结果: "${query}"\n\n`;
  output += `**网关地址:** ${gatewayUrl}  |  **搜索范围:** ${targetServices.length} 个服务  |  **共找到 ${allResults.length} 个匹配标签**\n\n`;
  output += `| 服务 | 标签 | 接口数 | 描述 |\n`;
  output += `|------|------|--------|------|\n`;
  for (const r of allResults) {
    output += `| ${r.服务} | ${r.标签} | ${r.接口数} | ${r.描述} |\n`;
  }

  return output;
}

// ---------------------------------------------------------------------------
// 命令行入口
// ---------------------------------------------------------------------------

function printHelp() {
  console.log(`Swagger / OpenAPI 接口文档获取工具

用法:
  node swagger_client.mjs <命令> [选项]

命令:
  fetch       从 URL 获取并输出完整 API 文档（Markdown 格式）
  parse       从本地文件解析并输出完整 API 文档（Markdown 格式）
  list        列出所有接口路径（简洁列表）
  search      按关键词搜索接口
  detail      获取单个接口的详细信息
  services    列出 Knife4j 网关下的所有微服务
  tags        列出单个服务的所有标签分组
  search-tags 跨服务搜索标签（快速定位接口所在服务）

选项:
  --url <url>           Swagger JSON 文档地址
  --gateway <url>       Knife4j 网关地址（用于 services/search-tags）
  --file <path>         本地 Swagger JSON 文件路径
  --username <user>     Basic Auth 用户名
  --password <pass>     Basic Auth 密码
  --token <token>       Bearer Token
  --tag <name>          按标签筛选
  --query <keyword>     搜索关键词
  --path <path>         接口路径
  --method <method>     HTTP 方法（get/post/put/delete）
  --detail              显示详细信息（services 命令显示接口统计）
  --filter <keyword>    按名称筛选（services 命令）/ 按服务名筛选（search-tags 命令）
  --group <name>        按分组筛选（如 cloudApi/restApi）
  --help                显示帮助信息

示例:
  # 获取完整 API 文档
  node swagger_client.mjs fetch --url http://localhost:8080/v2/api-docs

  # 列出所有接口
  node swagger_client.mjs list --url http://localhost:8080/v2/api-docs

  # 按标签筛选
  node swagger_client.mjs list --url http://localhost:8080/v2/api-docs --tag "用户管理"

  # 搜索接口
  node swagger_client.mjs search --url http://localhost:8080/v2/api-docs --query "登录"

  # 查看单个接口详情
  node swagger_client.mjs detail --url http://localhost:8080/v2/api-docs --path "/api/user/login" --method post

  # Knife4j 网关: 列出所有微服务
  node swagger_client.mjs services --gateway http://host:port

  # Knife4j 网关: 列出微服务及接口统计
  node swagger_client.mjs services --gateway http://host:port --detail

  # 列出单个服务的标签分组
  node swagger_client.mjs tags --url http://host:port/service/v3/api-docs?group=restApi

  # 跨 restApi 服务搜索标签
  node swagger_client.mjs search-tags --gateway http://host:port --query "审批"

  # 搜索特定分组的标签
  node swagger_client.mjs search-tags --gateway http://host:port --query "核算" --group restApi

  # 带认证
  node swagger_client.mjs fetch --url http://localhost:8080/v3/api-docs --token "xxx"
  node swagger_client.mjs fetch --url http://localhost:8080/v2/api-docs --username admin --password admin123
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  const options = {};
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      const val = args[i + 1];
      if (val && !val.startsWith('--')) {
        options[key] = val;
        i++;
      } else {
        options[key] = true;
      }
    }
  }

  const auth = {
    username: options.username,
    password: options.password,
    token: options.token,
  };

  try {
    let doc, parser;

    // ---- 不需要预先 fetchDoc 的命令 ----
    if (command === 'services') {
      if (!options.gateway) throw new Error('请指定 --gateway 网关地址（如 http://host:port）');
      console.log(await toServicesOutput(options.gateway, {
        detail: options.detail,
        filter: options.filter,
        group: options.group,
      }));
      return;
    }

    if (command === 'search-tags') {
      if (!options.gateway) throw new Error('请指定 --gateway 网关地址（如 http://host:port）');
      if (!options.query) throw new Error('请指定 --query 搜索关键词');
      console.log(await toSearchTagsOutput(options.gateway, options.query, {
        group: options.group,
        filter: options.filter,
        auth,
      }));
      return;
    }

    // ---- commands that may need to fetch a doc ----
    if (command === 'tags') {
      if (!options.url) throw new Error('请指定 --url 参数');
      const tagsDoc = await fetchDoc(options.url, auth);
      const tagsParser = new SwaggerParser(tagsDoc);
      console.log(await toTagsOutput(options.url, auth));
      return;
    }

    // ---- 标准命令: 需要 url 或 file ----
    if (command === 'parse') {
      if (!options.file) throw new Error('请指定 --file 参数');
      doc = loadDoc(options.file);
    } else {
      if (!options.url) throw new Error('请指定 --url 参数');
      doc = await fetchDoc(options.url, auth);
    }

    parser = new SwaggerParser(doc);

    switch (command) {
      case 'fetch':
      case 'parse':
        console.log(toMarkdown(parser));
        break;

      case 'list':
        console.log(toList(parser, { tag: options.tag }));
        break;

      case 'search': {
        if (!options.query) throw new Error('请指定 --query 搜索关键词');
        const paths = parser.getPaths();
        const q = options.query.toLowerCase();
        const results = paths.filter(p =>
          p.路径.toLowerCase().includes(q) ||
          p.摘要.toLowerCase().includes(q) ||
          p.描述.toLowerCase().includes(q) ||
          p.标签.some(t => t.toLowerCase().includes(q))
        );
        console.log(`# 搜索结果: "${options.query}"\n`);
        console.log(`共找到 ${results.length} 个匹配接口\n`);
        console.log(`| 方法 | 路径 | 标签 | 摘要 |`);
        console.log(`|------|------|------|------|`);
        for (const r of results) {
          console.log(`| ${r.方法} | ${r.路径} | ${r.标签.join(', ')} | ${r.摘要} |`);
        }
        break;
      }

      case 'detail': {
        if (!options.path) throw new Error('请指定 --path 接口路径');
        const paths = parser.getPaths();
        const detail = paths.find(p => {
          const pathMatch = p.路径 === options.path;
          const methodMatch = options.method ? p.方法 === options.method.toUpperCase() : true;
          return pathMatch && methodMatch;
        });
        if (!detail) {
          console.log(`未找到接口: ${options.method || 'ANY'} ${options.path}`);
          const similar = paths.filter(p => p.路径.includes(options.path));
          if (similar.length > 0) {
            console.log(`\n相似接口:\n`);
            for (const s of similar) {
              console.log(`  ${s.方法} ${s.路径} - ${s.摘要}`);
            }
          }
          return;
        }
        console.log(`# ${detail.方法} ${detail.路径}\n`);
        console.log(`**摘要:** ${detail.摘要}`);
        console.log(`**标签:** ${detail.标签.join(', ')}`);
        if (detail.描述) console.log(`**描述:** ${detail.描述}`);
        console.log();
        if (detail.参数.length > 0) {
          console.log(`## 参数\n`);
          console.log(`| 名称 | 位置 | 类型 | 必填 | 描述 |`);
          console.log(`|------|------|------|------|------|`);
          for (const p of detail.参数) {
            console.log(`| ${p.名称} | ${p.位置} | ${p.类型} | ${p.必填 ? '是' : '否'} | ${p.描述} |`);
          }
          console.log();
        }
        if (detail.请求体) {
          console.log(`## 请求体\n`);
          console.log(formatSchemaTable(detail.请求体.属性, 0));
        }
        if (detail.响应.length > 0) {
          console.log(`## 响应\n`);
          for (const r of detail.响应) {
            console.log(`**${r.状态码}** - ${r.描述}`);
            if (r.属性.length > 0) {
              console.log(formatSchemaTable(r.属性, 0));
            }
          }
        }
        break;
      }

      default:
        console.log(`未知命令: ${command}`);
        printHelp();
    }
  } catch (err) {
    console.error(`错误: ${err.message}`);
    process.exit(1);
  }
}

main();
