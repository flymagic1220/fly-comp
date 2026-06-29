---
name: jira-issues
description: 获取和分析 JIRA 问题（Bug/Task/Story），帮助定位代码、提供修复建议、更新问题状态。当用户提到 JIRA 问题编号、Bug 修复、查看 JIRA 需求或任务时使用。
---

# JIRA 问题处理工具

> **团队配置**：本 Skill 依赖 `../team-config.md` 中的以下配置项：
>
> - 一、项目信息 → 目录约定（API 封装目录、路由配置目录、页面组件目录）
> - 二、JIRA 配置（项目 Key、本地化字段名）
> - 四、API 配置（鉴权 Header、LocalStorage Token Key）
> - 五、工具链 & CLI
> - 六、MCP 服务器 → Atlassian (Jira + Confluence)
> - 八、路由 & 代码定位约定

通过 Atlassian MCP Server（`atlassian`）获取和处理 JIRA 中的 Bug、任务、需求（Story），辅助开发工作流。

## 前置条件

1. **Atlassian MCP Server 已配置** — 已在 CodeBuddy 的 MCP 设置中添加 `atlassian` 服务器（使用 `mcp-atlassian` 包）。
2. **Personal Access Token 已生成** — 在 JIRA（头像 → 个人设置 → 个人访问令牌）中创建 PAT，填入 MCP 配置的 `JIRA_PERSONAL_TOKEN`。

> 首次使用时，检查 `mcp.json` 中 `atlassian` 的 `env.JIRA_PERSONAL_TOKEN` 是否已填写真实 Token。
> 该 MCP Server 同时支持 Jira 和 Confluence，对应工具前缀分别为 `jira_` 和 `confluence_`。

## 使用流程

### 场景一：获取单个问题

当用户提供 Issue Key（如 `（见团队配置：二、JIRA 项目 Key）-1234`）时：

1. 调用 `jira_get_issue` 获取问题详情（评论通过 `comment_limit` 参数一并获取）
2. 展示问题摘要：标题、类型、状态、负责人、优先级、描述、评论

```
jira_get_issue(issue_key="（见团队配置：二、项目 Key）-1234", comment_limit=10)
```

### 场景二：搜索问题

当用户描述查找条件（如"我未关闭的 bug"、"项目 XXX 的所有任务"）时。

#### ⚠️ 核心原则：先用宽查询摸底，再精确过滤（最多 2 次 API 调用）

**JIRA 字段名可能因本地化而不同**（如 Bug → "故障"，Closed → "关闭"，Open → "待处理"）。**禁止**直接用英文猜测 `issuetype`、`status` 等字段值，必须先无过滤查询确认实际值。

#### 标准两步法

**第 1 步：宽查询摸底** — 不加 `issuetype`/`status` 过滤，只按用户维度查询，观察返回结果中的实际字段名：

```
// 查用户的所有问题（不限类型、不限状态），limit 适当放大以便观察
assignee = currentUser() ORDER BY updated DESC
// 或按项目
project = DMP ORDER BY updated DESC
```

从返回结果中提取：

- `issue_type.name` 的**实际值**（见团队配置：二、本地化字段名）
- `status.name` 的**实际值**（见团队配置：二、本地化字段名）

**第 2 步：精确过滤** — 用第 1 步发现的字段值拼 JQL：

```
// 示例：如果发现 Bug 叫 "故障"，关闭叫 "关闭"
assignee = currentUser() AND issuetype = "故障" AND status != "关闭" ORDER BY priority DESC
```

> 💡 **包含空格的字段值必须用双引号包裹**，如 `issuetype = "故障"`、`status != "关闭"`。

#### JQL 参考（字段值需替换为实际值）

| 用户意图         | 两步法                                                                |
| ---------------- | --------------------------------------------------------------------- |
| 我未关闭的 bug   | 1. `assignee = currentUser()` → 2. 替换 `issuetype` 和 `status`       |
| 项目所有开放问题 | 1. `project = （见团队配置：二、项目 Key）` → 2. 替换 `status` 后过滤 |
| 某个版本的问题   | 版本号通常不需要本地化，可直接用 `fixVersion = "v1.2.0"`              |
| 最近更新的问题   | 宽查询本身即足够，`ORDER BY updated DESC` 通常无需再加过滤            |

#### 错误示范（禁止）

```
❌ issuetype = Bug AND status != Closed     // 英文猜测，本地化 JIRA 返回 0
❌ issuetype = Bug                          // 同上，反复尝试不同写法
❌ resolution = Unresolved                  // 同样取决于本地化字段名
```

### 场景三：修复 Bug

修复 Bug 分三个阶段：**先分析确认，再动手修改，最后验证**。

**注意：每个阶段的每个步骤都必须执行，不能跳过**

#### 阶段一：分析与方案（必须遵守只读规定，不动代码）

> ⚠️ **阶段一禁止直接修改代码**。只做搜索和阅读，不调用 `write_to_file` 或 `replace_in_file`。

1. **获取 Bug 内容** — 调用 `jira_get_issue`（含 `comment_limit=20` 获取评论）
2. **分析 Bug** — 提取：
   - 问题现象（实际结果 vs 期望结果）
   - 复现步骤
   - 影响范围（模块/页面）
   - 附件或截图链接
3. **诊断问题归属** — 对于数据展示类 Bug（列表/详情字段未回显、值异常等），必须先确定是前端还是后端问题，才能决定谁来修：
   - ① 用 `playwright-cli open --headed` 打开对应页面，通过 `network` 或 `run-code` 捕获目标 API 的请求 URL
   - ② 用 `playwright-cli localstorage-get （见团队配置：四、LocalStorage Token Key）` 获取 token，然后 `curl '<api-url>' -H '（见团队配置：四、鉴权 Header 名）: （见团队配置：四、Header 值格式） <token>'` 直接调用该接口
   - ③ 检查响应 JSON：目标字段是否存在？字段名是否与接口文档一致？字段值是否正确？
   - ④ 得出结论：
     - **API 返回正常**（字段存在且值正确）→ 前端渲染/绑定问题，继续第 4 步定位代码
     - **API 返回异常**（字段缺失/字段名不一致/值为空或错误）→ 后端问题，输出诊断结论（接口地址、实际返回 vs 期望返回），建议转给后端处理，流程到此结束
4. **定位代码** — 根据 Bug 描述中的页面/模块名，按以下优先级策略定位：

   **策略一：路由注释定位（优先）**
   - 在 （见团队配置：一、路由配置目录） 目录中搜索 Bug 描述中的中文模块名（如"实时任务管理"、"用户管理"等）
   - 路由文件通常有 （见团队配置：八、路由文件注释格式） 注释，且包含 （见团队配置：八、路由组件导入方式） 直接给出组件路径
   - 根据组件路径直接读取目标文件，然后在文件内搜索具体字段/文案确认修改位置

   **策略二：精确文案搜索（路由未命中时）**
   - 用 `search_content` 在 `.vue` 文件中搜索 Bug 描述提及的具体文案/字段名
   - 例如 Bug 说"启用时间与需求不一致"，直接搜索当前使用的错误文案"启动时间"

   **策略三：code-explorer 广搜（上述策略均未命中时）**
   - 仅在前两种策略都无法定位时，才使用 `code-explorer` subagent 进行广范围搜索
   - prompt 应尽量聚焦，避免过多搜索步骤

5. **输出修复方案** — **必须**按「Bug 分析模板」完整输出（不可简化），包含：
   - 环境信息、问题描述、复现步骤、期望结果 vs 实际结果
   - 影响范围、涉及代码、根因分析（直接原因 + 根本原因）
   - 具体改动方案（改动前后对比）、影响面评估、需新增的测试点
6. **等待用户确认** — 使用 `ask_followup_question` 让用户选择：
   - "按方案执行修复"
   - "调整方案"（用户补充意见后重新输出方案）
   - "仅分析，暂不修改"

#### 阶段二：执行修改（用户确认后）

用户确认方案后，才执行：

1. 按确认的方案，逐一修改代码文件
2. 修改完成后汇总变更清单
3. **可选**：调用 `jira_add_comment` 添加修复说明
4. **可选**：调用 `jira_update_issue` 更新状态（如 "已解决"、"待测试"）
5. **安全审查**：如果改动涉及认证、权限、敏感数据、URL 参数等，检查是否引入新的安全风险（XSS、越权、信息泄露）

#### 阶段三：验证修复（修改完成后）

修改完成后，**主动**执行验证。

##### 3.1 代码层面验证（每次必做）

重新读取修改过的文件，确认改动与方案一致。

##### 3.2 运行时验证（根据 Bug 类型选择）

**验证前的准备工作（必做）：**

1. **检查必须工具是否就绪** — 在启动任何验证之前，先检查环境：
   - 检查 `playwright-cli` 是否可用：执行 `which playwright-cli`，如果不存在，用 `npm install -g @playwright/cli@latest` 安装
   - 检查 Chromium 浏览器是否已安装：执行 `playwright-cli install-browser --list` 或检查 `~/Library/Caches/ms-playwright/chromium-*/chrome-mac-arm64/`（macOS）/ `~/.cache/ms-playwright/chromium-*/chrome-linux64/`（Linux）是否存在
   - 如果浏览器未安装，执行 `playwright-cli install-browser chromium --force` 安装（约 170MB）
2. **根据 Bug 环境启动本地开发服务** — 不要在错误的服务器上验证：
   - 从 JIRA Bug 的描述中提取环境信息（一般标注为"测试环境"/"开发环境"/"生产环境"）
   - 读取 `package.json` 的 `scripts` 字段，找到对应环境的启动命令（如 `dev:test` → 测试环境，`dev` → 开发环境）
   - 使用对应命令启动本地开发服务器（如 `pnpm dev:test`），确保连接的是 Bug 所在环境的后端 API
   - 等待服务启动后，再用 `playwright-cli open --headed` 打开页面
3. **确认页面路由** — 打开页面前，不要猜测 URL：
   - 搜索模块关键词，找到路由配置
   - 确认路由模式：`createWebHistory`（路径模式）vs `createWebHashHistory`（hash 模式）
   - 根据路由前缀拼接完整的正确 URL
4. **确认登录状态** — 打开目标页面后，先 `snapshot` 检查，让用户选择处理方式：
   - 如果出现登录对话框 → 让用户选择：① 提供账号密码，由 AI 通过 `fill` + `click` 自动填写登录；② 用户自己在浏览器窗口中手动完成登录
   - 如果出现错误遮罩层 → 用 `click` 关闭
   - 只有页面正常展示数据后，才进入验证步骤

| Bug 类型      | 验证方式                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 前端 UI/交互  | 用 `playwright-cli open --headed` 打开**可见浏览器**（用户可实时观察交互过程）→ 按复现步骤逐条操作 → snapshot 断言关键元素。验证完成后按下方清理策略处理（先询问是否还有 Bug，再决定是否关闭浏览器）                                                                                                                                                                    |
| 后端逻辑/API  | 利用 Playwright 取 Token：① `playwright-cli open --headed <页面地址>` 打开应用（用户登录后 token 存入 localStorage）→ ② `playwright-cli localstorage-get （见团队配置：四、LocalStorage Token Key）` 获取 token → ③ `curl '<api-url>' -H '（见团队配置：四、鉴权 Header 名）: （见团队配置：四、Header 值格式） <token>'` 调用目标接口，检查返回数据/状态码是否符合预期 |
| 数据处理/计算 | 构造正常值、边界值、异常值三类输入，验证输出结果是否正确                                                                                                                                                                                                                                                                                                                |
| 配置/环境     | 检查对应配置文件是否生效                                                                                                                                                                                                                                                                                                                                                |

> ⚠️ **验证完成后的清理策略**：
>
> 验证通过后，**先不要关闭浏览器**，而是询问用户："还有其他 Bug 需要修复吗？"
>
> - **用户表示还有** → 保持浏览器打开、保持当前登录态，继续下一个 Bug 的修复流程（跳过启动浏览器和登录步骤，直接从阶段一获取 Bug 内容开始）
> - **用户表示没有了** → 执行清理：
>   - `playwright-cli close` 关闭浏览器
>   - 停止本地开发服务（`kill` 对应端口的进程）
>   - 删除 `.playwright-cli/` 目录（含 `page-*.yml`、`console-*.log` 等中间文件）
>
> ⚠️ **前端 UI 验证要求**：`playwright-cli` 启动独立 Chromium 浏览器窗口（headed 模式），用户可在桌面实时看到交互过程，无需额外截图或录制视频。
>
> ⚠️ **表单操作类 Bug 的 Playwright 操作指南**：项目使用 Element Plus 组件，其渲染结构与原生 HTML 不同，需注意以下操作方式：
>
> | 组件                       | playwright-cli 操作方式                                                            |
> | -------------------------- | ---------------------------------------------------------------------------------- |
> | `el-input`（文本/数字）    | `fill <ref> "值"` 直接填入                                                         |
> | `el-select`（下拉选择）    | `click <ref>` 打开下拉面板 → 再次 `snapshot` 获取选项 ref → `click <选项ref>` 选中 |
> | `el-date-picker`（日期）   | `click <ref>` 打开日期面板 → `snapshot` → `click <日期ref>` 选中                   |
> | `el-checkbox` / `el-radio` | `click <ref>` 勾选/选中                                                            |
> | `el-switch`                | `click <ref>` 切换                                                                 |
> | `el-upload`（文件上传）    | `upload <ref> ./file.pdf`                                                          |
> | 表单提交按钮               | `click <按钮ref>` 触发提交                                                         |
>
> 操作原则：**每次交互后先 `snapshot` 获取最新 ref，再操作下一步**，避免因 DOM 更新导致 ref 失效。提交流程通常为：填表 → 点击提交 → `snapshot` 检查结果提示/页面跳转 → 必要时 `curl` 验证后端数据落库。
>
> ⚠️ **后端 API 鉴权说明**：项目中所有 API 请求通过自定义 Header `（见团队配置：四、鉴权 Header 名）: （见团队配置：四、Header 值格式） <token>` 鉴权。利用 Playwright 打开应用页面后，登录流程会自动完成并将 token 存入 `localStorage`（key: （见团队配置：四、LocalStorage Token Key）），通过 `localstorage-get （见团队配置：四、LocalStorage Token Key）` 即可取出复用，无需手动拼接 OAuth 请求。

##### 3.3 汇总验证结果

用表格列出每个验证项及其通过/失败状态。验证不通过则回到阶段二调整代码。

> 💡 验证目标是证明「实际结果已等于期望结果」，应结合 Bug 描述中的期望结果和复现步骤来判断。
>
> 💡 验证通过后，提醒用户：要说"提交代码"可以触发 `gitlab-ops` Skill 进入提交和推送流程。

### 场景四：创建问题

当用户需要创建 Bug 或任务时：

1. 先调用 `jira_get_project_issues` 确认项目及可用的问题类型
2. 收集必要信息：标题、描述、类型、优先级
3. 调用 `jira_create_issue` 创建

### 场景五：更新问题

- **更新字段**：`jira_update_issue`（修改标题、描述、负责人等）
- **流转状态**：先 `jira_get_transitions` 获取可用流转，再 `jira_transition_issue` 执行流转
- **添加评论**：`jira_add_comment`（修复说明、进度更新）
- **分配人员**：通过 `jira_update_issue` 设置 `fields={"assignee":"用户名或邮箱"}` 来分配
- **附加文件**：通过 `jira_update_issue` 的 `attachments` 参数附加文件

## Bug 分析模板

获取 Bug 后，按以下结构展示：

```markdown
## Bug 分析：（见团队配置：二、项目 Key）-1234

**标题**：xxx
**类型**：Bug | **优先级**：High | **状态**：Open
**负责人**：张三 | **报告人**：李四

### 环境信息

- 浏览器：Chrome 120 / Edge 120
- 操作系统：Windows 11 / macOS 14
- 屏幕分辨率：1920×1080
- 环境：dev / test / prod

### 问题描述

...

### 复现步骤

1. ...
2. ...

### 期望结果

...

### 实际结果

...

### 影响范围

- 模块：xxx
- 页面：xxx

### 涉及代码（定位后补充）

- `src/components/xxx.vue` — 原因说明
- `src/utils/xxx.ts` — 原因说明

### 根因分析

说明 Bug 发生的根本原因（参考 5 Whys）：

- 直接原因：xxx 处逻辑未处理 xxx 情况
- 根本原因：缺少边界条件校验 / 接口字段变更未同步 / 组件状态管理不当 / ...

### 修复方案

1. 在 xxx 处修改 xxx
2. ...

### 评论讨论

（来自 jira_get_issue 的评论输出）
```

## 与开发工作流的集成

在 `requirement-to-plan` 工作流中，如果需求在 JIRA 上：

```
用户："帮我实现 （见团队配置：二、项目 Key）-1234 这个需求"
  → 1. 加载 jira-issues skill，获取 JIRA 问题内容
  → 2. 加载 requirement-to-plan skill，进入常规开发流程
  → 3. 开发完成后，更新 JIRA 状态 + 添加修复说明
```

修复完成后的提交和推送流程，使用 `gitlab-ops` Skill。

### JIRA 状态流转建议

> ⚠️ **流转前必须先用 `jira_get_transitions` 获取当前问题的可用流转名称**。状态和流转名随 JIRA 工作流配置和本地化语言而异，不可用英文猜测（如 "In Progress"/"Resolved"）。正确流程：`jira_get_transitions(issue_key)` → 从返回列表中确认目标流转的 `name` 或 `id` → `jira_transition_issue`。

| 时机             | 操作                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------- |
| 开始修复         | `jira_get_transitions` → 找到"开始处理"类流转 → `jira_transition_issue`                 |
| 发布到测试环境后 | `jira_get_transitions` → 找到"解决"类流转 → `jira_transition_issue`，附加修复说明到评论 |

> ⚠️ 本地验证通过**不能**直接流转到已解决状态，需等代码发布到测试环境确认无误后再流转。关闭状态由 QA/用户手动流转，不在 skill 自动化范围内。

## 注意事项

- **JIRA 本地化**：`issuetype`（如 "故障"/"任务"）、`status`（如 "待处理"/"进行中"/"关闭"）、`priority` 等字段的值取决于 JIRA 实例的语言设置。**永远不要用英文值（Bug/Closed/Open）猜测**，必须先宽查询摸底获取实际值，再用实际值构造精确 JQL。
- **Token 安全**：JIRA PAT 敏感度等同于密码，不要打印到对话输出中
- **自托管 JIRA**：如果连接失败，检查 `JIRA_URL` 和 `JIRA_PERSONAL_TOKEN` 是否正确、网络是否可达
- **JQL 限制**：搜索时建议加上 `project` 限定，避免跨项目返回过多结果
- **Confluence 互通**：同一个 `atlassian` MCP Server 也提供 Confluence 工具（`confluence_search`、`confluence_get_page` 等），可通过 `confluence-requirements` skill 使用
