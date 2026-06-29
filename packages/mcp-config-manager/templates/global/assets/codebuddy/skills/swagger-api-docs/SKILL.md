---
name: swagger-api-docs
description: Fetch and parse Swagger/OpenAPI documentation from a running service. Supports OpenAPI 2.0 and 3.x. Can fetch from URL endpoints like /v2/api-docs or /v3/api-docs, parse local JSON files, list all endpoints, search by keyword, and output structured Markdown. Use when the user needs API interface documentation for development, wants to understand backend APIs, or mentions Swagger, OpenAPI, api-docs, or REST API documentation.
---

# Swagger / OpenAPI 接口文档获取工具

> **团队配置**：本 Skill 依赖 `../team-config.md` 中的以下配置项：
>
> - 五、工具链 & CLI（Swagger CLI 工具、配置文件、taxjoy-codebuddy-config）
> - 六、MCP 服务器

从运行中的后端服务获取 Swagger / OpenAPI 接口文档，解析为结构化的 Markdown，用于辅助前端开发、接口对接和代码生成。

## 前置条件

使用此 Skill 前，需要知道后端服务的 Swagger 文档地址。常见端点：

| 框架                               | 常见地址                                         |
| ---------------------------------- | ------------------------------------------------ |
| SpringBoot + SpringFox (Swagger 2) | `http://host:port/v2/api-docs`                   |
| SpringBoot + SpringDoc (OpenAPI 3) | `http://host:port/v3/api-docs`                   |
| SpringBoot + Knife4j               | `http://host:port/v2/api-docs` 或 `/v3/api-docs` |
| Node.js / Express                  | `http://host:port/api-docs` 或 `/swagger.json`   |
| Go / Gin                           | `http://host:port/swagger/doc.json`              |

如果服务需要认证才能访问 api-docs，可提供 username/password（Basic Auth）或 token（Bearer Token）。

### 推荐：使用项目配置文件

在项目根目录的 （见团队配置：五、配置文件） 中配置连接信息，AI 执行命令时从中读取并作为 CLI 参数传入。

> 首次执行 （见团队配置：五、工具链 → taxjoy-codebuddy-config） 同步命令时会自动从模板创建此文件。如果文件不存在，可手动从 npm 包中的 `config-template.json` 复制。

```json
{
  "swagger": {
    "gateway": "http://YOUR_KNIFE4J_GATEWAY_IP:PORT",
    "auth": {
      "type": "none",
      "token": "",
      "username": "",
      "password": ""
    }
  }
}
```

字段说明：

- `gateway`：Knife4j 微服务网关地址，`services`、`search-tags` 命令必须传入 `--gateway`。**从 （见团队配置：五、配置文件） 中读取此值后通过 CLI 参数传入**。
- `auth`：可选，如网关需要认证则填写。

> **注意：** （见团队配置：五、Swagger CLI 工具） 不自动读取配置文件，需要 AI 从 （见团队配置：五、配置文件） 读取 gateway 后作为 `--gateway` 参数传入。
>
> **安全：** （见团队配置：五、配置文件） 包含敏感信息，建议加入 `.gitignore`。

## 使用流程

### 第 1 步：确定文档地址

- 如果用户提供了明确的 Swagger URL → 直接使用
- 如果用户只提供了服务地址 → 依次尝试 `/v2/api-docs`、`/v3/api-docs`
- 如果用户不知道地址 → 引导用户在 Swagger UI 页面找到 JSON 入口链接（通常在页面顶部显示）
- **如果是 Knife4j 微服务网关**（如 `http://host:port/doc.html`），使用 `services` / `search-tags` 命令快速定位

### 第 2 步：执行脚本

优先使用 **Node.js 版**（零依赖），当 Node.js 不可用时使用 Python 版。

#### Node.js 版（推荐）

> 以下命令中的 `scripts/swagger_client.mjs` 为项目内置的 Swagger CLI 工具（见团队配置：五、Swagger CLI 工具），更换团队时替换为你的工具路径。

```bash
node scripts/swagger_client.mjs <命令> [选项]
```

**获取完整 API 文档（Markdown 格式）：**

```bash
node scripts/swagger_client.mjs fetch --url "http://host:port/v2/api-docs"
```

> 输出为 Markdown 格式，显示在终端 stdout。如需保存到文件，使用 shell 重定向：
>
> ```bash
> node scripts/swagger_client.mjs fetch --url "http://host:port/v2/api-docs" > ./demandData/API文档.md
> ```

**列出所有接口（简洁列表，按标签分组）：**

```bash
node scripts/swagger_client.mjs list --url "http://host:port/v2/api-docs"
```

**按标签/分组筛选：**

```bash
node scripts/swagger_client.mjs list --url "http://host:port/v2/api-docs" --tag "用户管理"
```

**搜索接口（按路径、摘要、描述、标签模糊匹配）：**

```bash
node scripts/swagger_client.mjs search --url "http://host:port/v2/api-docs" --query "登录"
```

**查看单个接口详情：**

```bash
node scripts/swagger_client.mjs detail --url "http://host:port/v2/api-docs" --path "/api/user/login" --method post
```

**带认证访问：**

```bash
# Bearer Token
node scripts/swagger_client.mjs fetch --url "http://host:port/v2/api-docs" --token "xxx"

# Basic Auth
node scripts/swagger_client.mjs fetch --url "http://host:port/v2/api-docs" --username admin --password admin123
```

**从本地文件解析：**

```bash
node scripts/swagger_client.mjs parse --file ./swagger.json
```

**Knife4j 网关 - 列出所有微服务：**

```bash
# 列出网关下所有服务
node scripts/swagger_client.mjs services --gateway "http://host:port"

# 仅列出 restApi（前端接口）
node scripts/swagger_client.mjs services --gateway "http://host:port" --filter "rest"

# 列出服务及接口统计
node scripts/swagger_client.mjs services --gateway "http://host:port" --detail
```

**Knife4j 网关 - 跨服务搜索标签（快速定位接口所在服务）：**

```bash
# 在所有 restApi 服务中搜索标签
node scripts/swagger_client.mjs search-tags --gateway "http://host:port" --query "审批"

# 搜索特定分组
node scripts/swagger_client.mjs search-tags --gateway "http://host:port" --query "核算" --group restApi

# 只搜索特定服务
node scripts/swagger_client.mjs search-tags --gateway "http://host:port" --query "配置" --filter "bc-tax"
```

**查看单个服务的标签分组：**

```bash
node scripts/swagger_client.mjs tags --url "http://host:port/service/v3/api-docs?group=restApi"
```

#### Python 版（需要 `pip install requests`）

```bash
pip install requests
python scripts/swagger_client.py <命令> [选项]
```

命令结构与 Node.js 版相同。

### 第 3 步：处理结果

swagger_client 所有命令**仅输出到 stdout，不会自动写入文件**。如需保留文档：

- **终端重定向**：`node scripts/swagger_client.mjs fetch ... > ./demandData/API文档.md`
- **AI 写文件**：在 `requirement-to-plan` 工作流中，AI 应使用 `write_to_file` 将汇总后的内容保存到 `$DEMAND_DIR/API文档.md`
- **自定义路径**：通过重定向或 `write_to_file` 指定任意路径

获取接口文档后：

1. **查看终端输出** — swagger_client 将文档输出到 stdout，可管道传给 AI 处理或手动重定向到文件
2. **提取关键接口** — 根据需求文档筛选相关接口
3. **生成类型定义** — 根据接口的请求/响应结构，生成 TypeScript 类型或 API 调用代码
4. **识别依赖关系** — 分析接口之间的调用顺序和数据依赖

### 第 4 步：常见问题处理

| 问题             | 解决方案                                             |
| ---------------- | ---------------------------------------------------- |
| 连接被拒绝       | 确认服务是否在运行，地址和端口是否正确               |
| 401/403          | 提供认证信息（--token 或 --username --password）     |
| 404              | 尝试其他常见端点（/v2/api-docs → /v3/api-docs）      |
| JSON 解析失败    | 检查返回的是否是 JSON 格式（可能返回了 HTML 登录页） |
| 嵌套引用无法解析 | 复杂 $ref 引用可能无法完全展开，可手动查看原 JSON    |

## 输出格式

### fetch/parse 命令输出

输出完整的 Markdown 格式接口文档：

```markdown
# 用户管理系统 - API 接口文档

**版本:** 1.0.0 | **API 版本:** 2.0 | **服务地址:** http://localhost:8080

## 目录

共 **15** 个接口，**3** 个分组

- **用户管理** (5 个接口)
  - [POST /api/user/login]
  - [GET /api/user/info]
    ...

---

## 用户管理

### POST /api/user/login

**用户登录**

**请求体:** (必填)
| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应:**

- **200** 登录成功
  | 名称 | 类型 | 必填 | 描述 |
  |------|------|------|------|
  | token | string | 是 | JWT Token |
```

### list 命令输出

简洁的接口列表，按标签分组。

### search 命令输出

匹配关键词的接口列表。

## 高级用法

### Knife4j 微服务网关场景（推荐工作流）

当后端使用微服务架构并通过 Knife4j 网关聚合文档时，使用以下三步流程快速定位接口：

1. **`search-tags`** — 根据需求关键词搜索所有 restApi 服务的标签，快速定位到"哪个服务 → 哪个分组"
2. **`list --url <服务地址> --tag <分组名>`** — 列出该分组下的所有接口
3. **`detail`** — 按需查看具体接口的请求/响应结构

示例：需求涉及"审批流程"

```bash
# 第 1 步：找到审批相关标签所在的微服务
node scripts/swagger_client.mjs search-tags --gateway "http://host:port" --query "审批"
# 输出: pm-flow-rest → 审批中心 (13个接口)

# 第 2 步：查看审批中心分组下的所有接口
node scripts/swagger_client.mjs list --url "http://host:port/pm-flow/v3/api-docs?group=restApi" --tag "审批中心"

# 第 3 步：查看具体接口详情
node scripts/swagger_client.mjs detail --url "http://host:port/pm-flow/v3/api-docs?group=restApi" --path "/approval-center/page" --method post
```

### 前端开发场景

1. 用 `search` 根据页面需求找到相关接口
2. 用 `detail` 查看接口的请求/响应结构
3. 根据响应结构生成 TypeScript 类型定义
4. 如需保存文档，用 shell 重定向：`... > ./path/to/file.md`

### 接口对接场景

1. 用 `list` 了解所有可用接口
2. 用 `search` 找到需要对接的接口
3. 用 `fetch` 导出完整文档（stdout），需要时重定向到文件

### 文件输出

**所有命令仅输出到 stdout，不会自动写文件。** 如需保存，使用以下方式之一：

- **Shell 重定向**：`node scripts/swagger_client.mjs fetch ... > ./demandData/API文档.md`
- **AI 写文件**：在 `requirement-to-plan` 工作流中，AI 收集各命令的 stdout 输出后，用 `write_to_file` 保存到 `$DEMAND_DIR/API文档.md`
- **`--output` 参数**：部分命令支持 `--output` 指定保存路径
