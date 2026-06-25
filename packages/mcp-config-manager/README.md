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

## 开发

```bash
pnpm build    # 编译 TypeScript
pnpm dev      # watch 模式编译
```

## 迁移指南

更换团队或 IDE 时，以下文件需要重点关注修改：

### 🔧 更换团队

> 不同团队使用的服务（JIRA/Confluence 域名、GitLab 实例）、MCP 社区包、内部规范都可能不同。

| 修改点            | 文件                                        | 说明                                          |
| ----------------- | ------------------------------------------- | --------------------------------------------- |
| MCP Server 配置   | `templates/global/mcp.json`                 | 修改服务域名、包名、添加/删除 Server          |
| 团队通用 skill    | `templates/global/assets/codebuddy/skills/` | 替换为团队实际使用的 skill 文件               |
| 团队通用 rule     | `templates/global/assets/codebuddy/rules/`  | 替换为团队编码规范、命名约定等                |
| 项目级 MCP Server | `templates/local/mcp.json`                  | 项目专属服务的域名和包名                      |
| 项目级 rule       | `templates/local/assets/codebuddy/rules/`   | 项目级命名规范、业务规则等                    |
| 合并策略          | `src/merger.ts`                             | 占位符格式、数组匹配策略如需调整见文件内 TODO |

### 🔧 更换/新增 IDE

| 修改点         | 文件                             | 说明                                                                            |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------- |
| IDE 适配器定义 | `src/adapters.ts`                | 在 `IDE_ADAPTERS` 中添加/修改 IDE 的 `localDir`、`globalDir`、`configFile`      |
| 资产映射       | `src/adapters.ts`                | 配置该 IDE 的 `assetMappings`，将模板目录映射到 IDE 期望的路径                  |
| 资产模板目录   | `templates/global/assets/<ide>/` | 创建该 IDE 的全局资产目录和 .gitkeep                                            |
| 资产模板目录   | `templates/local/assets/<ide>/`  | 创建该 IDE 的项目级资产目录和 .gitkeep                                          |
| 配置格式化     | `src/formatters.ts`              | 如果新 IDE 的配置文件格式不同于标准 `{ mcpServers: {...} }`，需在此添加转换逻辑 |
| 用户级目录     | `src/adapters.ts`                | Claude Desktop 等全局路径在 `~/Library/Application Support/`，其他 IDE 可能不同 |
