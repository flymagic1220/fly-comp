# @fly/mcp-config-manager

多 IDE 通用 MCP 配置管理工具，支持 CodeBuddy、Cursor、Claude 等 IDE 的 MCP 服务器配置与团队资产分发。

## 功能

- **配置合并**：将团队通用 MCP 配置与项目本地配置智能合并
- **多 IDE 适配**：自动生成各 IDE 所需的配置格式
- **资产分发**：将团队 Skill、Rule 等非标准资产分发到对应 IDE 目录

## 安装

```bash
pnpm add -D @fly/mcp-config-manager
```

## 使用

```bash
# 初始化配置
npx mcp-setup init

# 指定目标 IDE
npx mcp-setup init --ide codebuddy

# 仅更新资产
npx mcp-setup sync-assets
```

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
    ├── global/           # 全局 MCP 服务器配置（团队通用）
    │   └── mcp.json
    ├── local/            # 项目级 MCP 配置（项目通用）
    │   └── mcp.json
    └── assets/           # IDE 专属资产（非 MCP 标准）
        ├── codebuddy/
        │   └── skills/   # CodeBuddy 技能文件
        ├── cursor/
        │   └── rules/    # Cursor 规则文件
        └── claude/       # Claude 配置（扩展预留）
```

## 开发

```bash
pnpm build    # 编译 TypeScript
pnpm dev      # watch 模式编译
```
