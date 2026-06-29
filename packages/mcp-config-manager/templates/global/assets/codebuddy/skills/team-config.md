# 团队配置

> **用途**：更换公司或团队时，只需修改本文件中的配置项，所有 Skill 将自动适配新环境。
>
> **使用方式**：各 SKILL.md 中通过 `（见团队配置：KEY）` 引用本文件的配置项。修改配置后，重新加载 Skill 即可生效。

---

## 一、项目信息

### 仓库

- **GitLab 地址示例**: `http://192.168.7.9/fe/taxjoy-doc.git`
- **GitLab 项目路径示例**: `fe/taxjoy-doc`

### 目录约定

- **API 封装目录**: `src/apis/`
- **公共接口目录**: `src/apis/common/`
- **路由配置目录**: `src/router/`
- **页面组件目录**: `src/views/`
- **需求文档存放目录**: `demandData/`

### 组件依赖

- **业务组件库**: `@bosssoft/taxjoy-components`
- **业务组件库简称**: `taxjoy-components`
- **UI 框架**: `element-plus`
- **业务表单组件**: `TJForm`

---

## 二、JIRA 配置

### 项目 Key

- **JIRA 项目 Key 示例**: `TAXJOY`、`DMP`

### 本地化字段名（取决于 JIRA 实例语言设置，需实际查询确认）

| 概念         | 当前名称         |
| ------------ | ---------------- |
| Bug 类型     | `故障`           |
| 任务类型     | `任务`           |
| 需求类型     | `故事`           |
| 已关闭状态   | `关闭`           |
| 进行中状态   | `进行中`         |
| 待处理状态   | `待处理`         |
| 开始处理流转 | 取决于工作流配置 |
| 解决流转     | 取决于工作流配置 |

---

## 三、Commit 规范

- **Commit 信息格式**: `<type>: <description> #<JIRA_ISSUE_KEY>`
- **JIRA Issue Type → Commit Type 映射**:
  - 故障 → `fix`
  - 需求 / Story → `feat`
  - 任务 → `chore`
- **Commitlint 配置文件**: `commitlint.config.js`

---

## 四、API 配置

- **鉴权方式**: 自定义 Header
- **鉴权 Header 名**: `access-token`
- **Header 值格式**: `Bearer <token>`
- **LocalStorage Token Key**: `TOKEN`

---

## 五、工具链 & CLI

| CLI 工具                     | 用途                    | 安装/获取方式    |
| ---------------------------- | ----------------------- | ---------------- |
| `taxjoy-codebuddy-config`    | 同步编码规范 & MCP 配置 | `npm install -g` |
| `scripts/swagger_client.mjs` | Swagger 接口文档获取    | 项目内置脚本     |

### 配置文件

- **项目级配置**: `codebuddy-config.json`（含 Swagger gateway 等信息，建议加入 `.gitignore`）

---

## 六、MCP 服务器

| 服务                          | MCP 包名               | 用途                            |
| ----------------------------- | ---------------------- | ------------------------------- |
| Atlassian (Jira + Confluence) | `mcp-atlassian`        | JIRA 问题管理 + Confluence 文档 |
| GitLab                        | `@zereight/mcp-gitlab` | GitLab 仓库操作                 |
| MasterGo                      | `mastergo-magic-mcp`   | 设计稿获取                      |

---

## 七、设计工具

- **主设计工具**: MasterGo
- **设计稿链接格式**:
  - `mastergo.com/file/<fileId>?layer_id=<layerId>`
  - `mastergo.com/goto/<shortLink>`

---

## 八、路由 & 代码定位约定

- **路由文件注释格式**: `// 模块名`
- **路由组件导入方式**: `component: () => import('@/views/...')`
- **代码定位优先级**: 路由注释定位 → 精确文案搜索 → code-explorer 广搜
