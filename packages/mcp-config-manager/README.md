# @fly/mcp-config-manager

多 IDE 通用 MCP 配置管理工具，支持 CodeBuddy、Cursor、Claude 等 IDE 的 MCP 服务器配置与团队资产分发。

## 功能

- **配置合并**：将团队通用 MCP 配置与项目本地配置智能合并
- **多 IDE 适配**：自动生成各 IDE 所需的配置格式
- **资产分发**：将团队 Skill、Rule 等非标准资产分发到对应 IDE 目录

## 安装

### 前置条件

| 依赖            | 版本要求                                       | 说明                                                               |
| --------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| **Node.js**     | >= 18                                          | `mcp-setup` 运行环境，Node.js MCP Server 通过 `npx` 启动           |
| **Python + uv** | >= 3.10                                        | 仅当使用 Python 编写的 MCP Server 时需要（如 `uvx mcp-atlassian`） |
| **支持的 IDE**  | CodeBuddy / Cursor / Claude Desktop / Continue | 需已安装并支持 MCP 协议                                            |

> `mcp-setup` 本身零运行时依赖，仅将配置文件写入 IDE 目录。MCP Server 包由 IDE 在首次连接时通过 `npx -y` 或 `uvx` 自动下载，无需手动安装。

### 安装工具

```bash
pnpm add -D @fly/mcp-config-manager
```

### 安装后步骤

```bash
# 1. 在模板中填入团队实际使用的 MCP Server 配置（见「配置 MCP Server」章节）
#    templates/global/mcp.json   — 团队通用服务
#    templates/local/mcp.json    — 项目专属服务

# 2. 执行安装命令
npx mcp-setup --global

# 3. 检查生成的配置文件，确保 token 已替换为实际值
#    CodeBuddy 全局: ~/.codebuddy/mcp.json
#    CodeBuddy 项目: <project>/.codebuddy/mcp.json

# 4. 重启 IDE，MCP Server 将自动连接
```

## 使用

### 全局安装（团队通用配置）

将团队级 MCP Server（jira/confluence/mastergo）和通用 skill/rule 安装到用户主目录，所有项目共享：

```bash
# 为 CodeBuddy 安装全局配置
npx mcp-setup --global

# 为 Cursor 安装全局配置
npx mcp-setup --global --ide cursor

# 为 Claude Desktop 安装全局配置
npx mcp-setup --global --ide claude
```

### 项目级安装（项目专属配置）

将项目级 MCP Server 和项目专属 skill/rule 安装到当前项目目录：

```bash
# 为 CodeBuddy 安装项目级配置
npx mcp-setup

# 为 Cursor 安装项目级配置
npx mcp-setup --ide cursor
```

### 强制覆盖

使用 `--force` 清除目标已有配置后重新安装，用于团队统一更新：

```bash
npx mcp-setup --global --force
```

### 配置层级说明

| 模式           | 源模板              | 安装目标                | 典型用途                             |
| -------------- | ------------------- | ----------------------- | ------------------------------------ |
| `--global`     | `templates/global/` | `~/.codebuddy/`         | 团队通用 MCP Server、通用 skill/rule |
| 默认（项目级） | `templates/local/`  | `<project>/.codebuddy/` | 项目专属 MCP Server、项目专属 rule   |

## 目录结构

```
.
├── src/
│   ├── setup.ts          # CLI 入口
│   ├── adapters.ts       # IDE 适配器（codebuddy/cursor/claude）
│   ├── formatters.ts     # 配置格式化
│   ├── merger.ts         # 配置合并逻辑
│   └── utils.ts          # 工具函数
└── templates/
    ├── global/           # 全局级模板（团队通用，安装到 ~/.codebuddy/）
    │   ├── mcp.json      # MCP Server 配置
    │   └── assets/       # 全局资产（团队统一 skill/rule）
    │       ├── codebuddy/skills/
    │       ├── cursor/rules/
    │       └── claude/
    └── local/            # 项目级模板（安装到 <project>/.codebuddy/）
        ├── mcp.json      # MCP Server 配置
        └── assets/       # 项目级资产（项目专属 skill/rule）
            ├── codebuddy/skills/
            └── cursor/rules/
```

## 配置 MCP Server

模板文件（`templates/global/mcp.json`、`templates/local/mcp.json`）默认不包含具体 Server 配置，需要由团队根据实际使用的服务填入。

### 为什么不预置具体配置

- **MCP 生态变化快**：包的参数、认证方式随时可能调整，硬编码配置容易过期
- **团队环境差异大**：Cloud 版 vs 自部署版、公网 vs 内网、是否需要 SSL 证书验证，各不相同
- **包选择多样化**：同一服务有多个社区包，功能、兼容性、运行环境（Node.js / Python）各不相同

### 如何获取正确的配置

#### 1. 确定服务部署方式

| 问题                                          | 影响                            |
| --------------------------------------------- | ------------------------------- |
| 是 Cloud 版还是自部署（Data Center/Server）？ | 决定包名、认证方式、URL 格式    |
| 是公网可访问还是仅内网？                      | 决定是否配置代理、SSL_VERIFY 等 |
| 使用 HTTP 还是 HTTPS？                        | 决定 URL scheme 和证书相关配置  |

#### 2. 查找可用的 MCP 包

| 渠道                | 地址                                            | 说明                         |
| ------------------- | ----------------------------------------------- | ---------------------------- |
| MCP 官方 Registry   | https://registry.modelcontextprotocol.io        | 官方收录                     |
| Awesome MCP Servers | https://github.com/punkpeye/awesome-mcp-servers | 社区分类最全                 |
| Smithery            | https://smithery.ai                             | 可视化搜索，可直接看配置示例 |
| npm 搜索            | `npm search mcp <service>`                      | 搜 Node.js 包                |
| PyPI 搜索           | `pip search mcp-` 或访问 pypi.org               | 搜 Python 包                 |

#### 3. 验证包是否可用

```bash
# Node.js 包：确认存在并查看 README
npm view <包名> --registry https://registry.npmjs.org

# Python 包：确认存在
pip index versions <包名> 2>/dev/null || pip install <包名> --dry-run

# 本地测试运行（确认能启动）
npx -y <包名> --help        # Node.js
uvx <包名> --help           # Python (需先安装 uv: pip install uv)
```

#### 4. 填入模板

验证通过后，按以下结构填入 `templates/global/mcp.json` 或 `templates/local/mcp.json`：

```jsonc
{
  "mcpServers": {
    "<server-name>": {
      "type": "stdio",
      "command": "npx", // Node.js 包用 npx，Python 包用 uvx
      "args": ["-y", "<包名>", "--token=<YOUR_TOKEN>", "--url=<服务地址>"],
      "description": "服务描述",
      "env": {
        // 环境变量（按包文档配置）
      },
      "disabled": false, // 设为 true 可临时禁用
    },
  },
}
```

> **提示**：`<YOUR_XXX>` 占位符会在合并时被保护——如果目标文件已有真实值，不会被模板覆盖。见 `src/merger.ts` 中的占位符保护逻辑。

### 常见运行环境

| 包的运行方式    | 前置依赖      | 安装命令                              |
| --------------- | ------------- | ------------------------------------- |
| `npx` (Node.js) | Node.js >= 18 | 通常已随 IDE 安装                     |
| `uvx` (Python)  | Python + uv   | `pip install uv` 或 `brew install uv` |

## 内置 Skills 通用工作流

本包通过 `templates/global/assets/codebuddy/skills/` 分发 5 个前端开发通用 Skill。每个 Skill 的核心工作流逻辑与具体团队/公司无关，团队相关配置统一集中在 `team-config.md` 中管理。换团队时只需修改 `team-config.md`，无需改动 SKILL.md 的流程逻辑。

各 Skill 依赖的团队配置项，参见各自 SKILL.md 顶部的「团队配置」声明。

---

### 1. confluence-requirements — Confluence 需求文档获取

**职责**：从 Confluence 获取 PRD、技术规格等文档，将 Confluence 存储格式转换为 Markdown。

**通用工作流**：

```
搜索页面（CQL 全文搜索）
  → 确认目标（单结果直接获取 / 多结果让用户选择）
  → 获取页面（convert_to_markdown=true 自动转 Markdown）
  → 保存到本地文件
```

| 步骤       | 说明                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------- |
| 搜索       | `confluence_search(query, limit)` — 支持空间限定 `space = "KEY"`、标签过滤 `label = "xxx"`     |
| 确认       | 多结果时以列表展示（序号、标题、空间、时间），用 `ask_followup_question` 让用户选择，支持多选  |
| 获取       | `confluence_get_page(page_id, convert_to_markdown=true)` — 直接返回 Markdown，无需手动转换     |
| 子内容获取 | 支持 `get_page_children`（子页面列表）、`get_comments`（评论）、`get_page_history`（版本历史） |

**无团队依赖的纯通用部分**：搜索→确认→获取→保存的四步流程，CQL 语法（`text ~`/`space =`/`type =`），以及 Markdown 转换逻辑。

---

### 2. gitlab-ops — GitLab 开发操作

**职责**：通过 GitLab MCP Server + Git CLI 完成代码提交、MR 管理、Code Review、Issue 管理、流水线查询等日常开发操作。

**通用工作流**（覆盖 8 个场景）：

| 场景                    | 核心流程                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| ① 代码提交与推送        | 生成 commit message（jira-issues 联动自动生成 or 用户输入）→ `git add` → `git commit` → `git pull --rebase` → `git push` |
| ② 创建 MR               | 识别 project_id → 选源/目标分支 → 选指派人 → 确认信息 → `create_merge_request`                                           |
| ③ MR 审查与 Code Review | 查看变更文件列表 → 查看 diff → 分析讨论 → 审批/评论/合并（合并前检查审批+流水线+冲突+讨论）                              |
| ④ Issue 管理            | 搜索/筛选 → 查看详情 → 创建/更新（支持标签、指派人、里程碑、截止日期）                                                   |
| ⑤ 提交历史分析          | 按分支/时间/文件/作者过滤 → 查看 commit → blame 追溯行级变更                                                             |
| ⑥ 流水线状态查询        | 查看 MR 流水线状态 → 查看 commit CI 状态                                                                                 |
| ⑦ 分支管理              | 列出 → 创建（从指定 ref）→ 删除 → 保护/取消保护                                                                          |
| ⑧ 仓库浏览与搜索        | 浏览目录树 → 查看文件内容 → 跨项目搜索代码 → 在线编辑文件                                                                |

**关键通用规则**：

- `project_id` 从 `git remote get-url origin` 提取路径后匹配，同一会话内复用
- `git pull --rebase` 出现冲突必须停止，让用户手动处理
- 合并 MR 前必须逐一检查审批状态、流水线状态、冲突状态、讨论状态
- MCP 工具采用按需激活的 category 机制，未激活时调用 `discover_tools`

**无团队依赖的纯通用部分**：所有 8 个场景的操作流程、project_id 识别机制、合并前检查清单、工具集 category 按需激活机制。

---

### 3. jira-issues — JIRA 问题处理

**职责**：获取和分析 JIRA Bug/Task/Story，辅助代码定位、提供修复方案、验证修复效果。

**通用工作流**（覆盖 5 个场景）：

| 场景               | 核心流程                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| ① 获取单个问题     | `jira_get_issue(issue_key, comment_limit)` → 展示摘要（标题、类型、状态、负责人、优先级、描述） |
| ② 搜索问题         | **两步法**：宽查询摸底（观察实际字段名）→ 用实际字段名精确过滤。禁止用英文猜测本地化字段值      |
| ③ 修复 Bug（重点） | **三阶段**：分析与方案（只读诊断）→ 执行修改（用户确认后）→ 验证修复（代码+运行时双层验证）     |
| ④ 创建问题         | 确认项目及可用类型 → 收集标题/描述/类型/优先级 → `jira_create_issue`                            |
| ⑤ 更新问题         | 获取可用流转（`jira_get_transitions`）→ 流转状态 → 添加评论 → 分配人员                          |

**Bug 修复三阶段（最核心的通用流程）**：

```
阶段一：分析与方案（只读，不修改代码）
  获取 Bug → 提取现象/复现步骤/期望结果
  → 诊断归属（curl 直调 API 判断前端/后端）
  → 定位代码（路由注释 → 精确文案搜索 → code-explorer 广搜，三级策略）
  → 输出完整分析模板（含根因分析 + 改动方案 + 影响面评估）
  → 等待用户确认

阶段二：执行修改（用户确认后）
  按方案逐一修改 → 汇总变更清单
  → 可选：添加 JIRA 评论 / 更新状态
  → 安全审查（认证/权限/敏感数据）

阶段三：验证修复（修改完成后）
  代码验证（重新读取确认改动一致）
  + 运行时验证（playwright-cli UI 验证 / curl API 验证 / 边界值验证）
  → 汇总验证结果 → 通过后提醒可触发 gitlab-ops 提交流程
```

**关键通用规则**：

- JIRA 字段名因本地化而异，禁止用英文值（Bug/Closed/Open）猜测，必须先用宽查询摸底
- 数据展示类 Bug 必须先诊断前后端归属（curl 直调 API），避免前端误修后端问题
- 代码定位三级策略：路由注释定位 > 精确文案搜索 > code-explorer 广搜
- 运行时验证前检查 playwright-cli 工具链、启动对应环境的本地服务、确认路由和登录状态
- 验证完成后不立即关闭浏览器，先询问是否还有其他 Bug

**无团队依赖的纯通用部分**：Bug 修复三阶段流程、前后端诊断决策树、三级代码定位策略、JQL 两步搜索法、运行时验证准备流程、Element Plus 组件操作指南。

---

### 4. requirement-to-plan — 需求实现工作流

**职责**：将"一句话需求"串联需求文档、接口文档、设计稿，自动生成结构化的前端开发计划。

**通用工作流（4 步串联，严格顺序执行）**：

```
第 1 步：获取需求文档
  搜索 Confluence → 确认目标页面 → 创建需求目录 → 保存 PRD.md

第 2 步：获取接口文档
  提取关键词 → 检查现有 API 封装（优先复用）
  → 读取网关配置 → 发现服务端点
  → search-tags 跨服务定位 → list 查看分组接口 → detail 获取详情
  → 汇总保存 API文档.md（必须显式 write_to_file）

第 3 步：获取设计稿（不可跳过，必须执行判断）
  分析需求是否涉及 UI 变更
  → 纯逻辑改动：跳过并标注
  → UI 变更：扫描 PRD 中的 MasterGo 链接 → 引导用户提供 → mcp__getMeta 获取 → 保存设计稿.md

第 4 步：生成开发计划
  汇总前 3 步信息 → 按模板生成结构化计划
  （需求摘要 + 涉及页面 + 接口清单 + 组件清单 + 设计稿关键信息 + 数据流 + 实现步骤）
  → 保存开发计划.md
```

**关键通用规则**：

- 必须严格按 1→2→3→4 顺序执行，禁止跳过任何步骤
- 第 3 步无论结论如何都必须显式执行判断并输出
- 接口搜索优先复用项目现有封装（✅ 已有），找不到才从 Swagger 获取（🔍 需对接）
- Swagger CLI 工具只输出到 stdout，不自动写文件，必须显式 `write_to_file`
- 搜索结果为 0 时告知用户，≥2 条时让用户选择
- 组件选择遵循优先级规则：业务组件库 > UI 框架 > 自定义

**无团队依赖的纯通用部分**：4 步串联流程、需求目录创建与文件管理、接口搜索与复用策略、search-tags→list→detail 的网关定位链路、设计稿获取决策逻辑、开发计划模板结构、组件优先级选择规则。

---

### 5. swagger-api-docs — Swagger/OpenAPI 接口文档获取

**职责**：从运行中的后端服务获取 Swagger/OpenAPI 文档，解析为结构化 Markdown，支持 Knife4j 微服务网关。

**通用工作流**：

```
第 1 步：确定文档地址
  用户提供 → 直接使用 / 自动探测 v2→v3 / 引导用户提供

第 2 步：选择模式执行
  ├── 单服务模式：fetch / list / search / detail
  └── Knife4j 网关模式：services → search-tags → list --tag → detail

第 3 步：处理结果
  stdout 输出 → shell 重定向保存 / AI write_to_file 保存

第 4 步：常见问题排查
  连接拒绝 / 401/403 / 404 / JSON 解析失败
```

**单服务模式命令**：

| 命令     | 用途                        |
| -------- | --------------------------- |
| `fetch`  | 获取完整 Markdown 接口文档  |
| `list`   | 列出所有接口（按标签分组）  |
| `search` | 按路径/摘要/标签模糊搜索    |
| `detail` | 查看单个接口的请求/响应结构 |

**Knife4j 网关模式命令**：

| 命令          | 用途                                                           |
| ------------- | -------------------------------------------------------------- |
| `services`    | 列出网关下所有微服务及其 API 文档端点（`--detail` 含接口统计） |
| `search-tags` | 跨所有 restApi 服务搜索标签，快速定位接口所在服务              |
| `tags`        | 查看单个服务的标签分组                                         |

**关键通用规则**：

- 不同服务使用不同 Swagger 端点版本（v2/v3），不能猜测，必须用 `services --detail` 发现
- 所有命令仅输出到 stdout，不自动写文件
- 支持 Bearer Token 和 Basic Auth 两种认证方式
- 支持解析本地 JSON 文件（`parse --file`）
- Node.js 版零依赖（推荐），Python 版作为备选

**无团队依赖的纯通用部分**：所有 CLI 命令逻辑、Swagger 文档解析引擎、Knife4j 网关三步定位法（search-tags→list→detail）、Markdown 输出格式、认证方式、常见问题排查表。

---

## 开发

```bash
pnpm build    # 编译 TypeScript
pnpm dev      # watch 模式编译
```

## 迁移指南

更换团队或 IDE 时，以下文件需要重点关注修改：

### 🔧 更换团队

> 不同团队使用的服务（JIRA/Confluence 域名、GitLab 实例）、MCP 社区包、内部规范都可能不同。

| 修改点                  | 文件                                                      | 说明                                                                             |
| ----------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **⚡ 团队配置（推荐）** | `templates/global/assets/codebuddy/skills/team-config.md` | **换团队只改这一个文件**：JIRA Key、GitLab 地址、组件库、目录约定、Commit 规范等 |
| MCP Server 配置         | `templates/global/mcp.json`                               | 修改服务域名、包名、添加/删除 Server                                             |
| 团队通用 rule           | `templates/global/assets/codebuddy/rules/`                | 替换为团队编码规范、命名约定等                                                   |
| 项目级 MCP Server       | `templates/local/mcp.json`                                | 项目专属服务的域名和包名                                                         |
| 项目级 rule             | `templates/local/assets/codebuddy/rules/`                 | 项目级命名规范、业务规则等                                                       |
| 合并策略                | `src/merger.ts`                                           | 占位符格式、数组匹配策略如需调整见文件内 TODO                                    |

> **Skills 无需修改**：所有 SKILL.md 的通用工作流逻辑与团队无关，团队相关配置通过 `（见团队配置：xxx）` 引用 `team-config.md`。详见「内置 Skills 通用工作流」章节。

### 🔧 更换/新增 IDE

| 修改点         | 文件                             | 说明                                                                            |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------- |
| IDE 适配器定义 | `src/adapters.ts`                | 在 `IDE_ADAPTERS` 中添加/修改 IDE 的 `localDir`、`globalDir`、`configFile`      |
| 资产映射       | `src/adapters.ts`                | 配置该 IDE 的 `assetMappings`，将模板目录映射到 IDE 期望的路径                  |
| 资产模板目录   | `templates/global/assets/<ide>/` | 创建该 IDE 的全局资产目录和 .gitkeep                                            |
| 资产模板目录   | `templates/local/assets/<ide>/`  | 创建该 IDE 的项目级资产目录和 .gitkeep                                          |
| 配置格式化     | `src/formatters.ts`              | 如果新 IDE 的配置文件格式不同于标准 `{ mcpServers: {...} }`，需在此添加转换逻辑 |
| 用户级目录     | `src/adapters.ts`                | Claude Desktop 等全局路径在 `~/Library/Application Support/`，其他 IDE 可能不同 |
