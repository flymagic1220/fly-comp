---
name: gitlab-ops
description: GitLab 操作工具 — 提交代码、推送分支、创建 MR、MR 审查、Issue 管理、提交历史分析、流水线查询、分支管理、仓库浏览。当用户提到提交代码、推送代码、合并请求、MR、Code Review、Issue、提交历史、流水线、分支、GitLab 时使用。
---

# GitLab 操作工具

> **团队配置**：本 Skill 依赖 `../team-config.md` 中的以下配置项：
>
> - 一、项目信息 → 仓库（GitLab 地址、项目路径）
> - 二、JIRA 配置 → 项目 Key
> - 三、Commit 规范（commit 格式、type 映射、commitlint 配置）
> - 六、MCP 服务器 → GitLab

通过 GitLab MCP Server（`@zereight/mcp-gitlab`）和 Git CLI 完成 GitLab 上的各类开发操作。

## 前置条件

1. **GitLab MCP Server 已配置** — 已在 CodeBuddy 的 MCP 设置中添加 `gitlab` 服务器（使用 `@zereight/mcp-gitlab`），token 通过 `--token` 参数传入。
2. **Personal Access Token 已生成** — GitLab 的 PAT 已填入 MCP 配置。

## 项目识别

大部分 MCP 操作都需要 `project_id`。获取方式：

1. 运行 `git remote get-url origin` 获取仓库地址（如 （见团队配置：一、仓库））
2. 从地址中提取项目路径（见团队配置：一、仓库）
3. 调用 `list_projects`（search 参数用路径关键字）匹配项目，得到 `project_id`
4. 同一会话内复用 `project_id`，无需重复查询

---

## 场景覆盖

| 场景                          | 触发词                                                                     | 主要 MCP 工具                                                                                                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 场景一：代码提交与推送        | "提交代码"、"推送代码"、"push"                                             | Git CLI（`git add/commit/push`）                                                                                                                                                     |
| 场景二：创建 MR               | "创建 MR"、"合并请求"、"提 MR"                                             | `create_merge_request`、`list_project_members`、`list_branches`                                                                                                                      |
| 场景三：MR 审查与 Code Review | "审查 MR"、"review MR"、"code review"、"MR 改了什么"、"审批 MR"、"合并 MR" | `get_merge_request`、`get_merge_request_diffs`、`list_merge_request_changed_files`、`mr_discussions`、`approve_merge_request`、`merge_merge_request`、`list_merge_request_pipelines` |
| 场景四：Issue 管理            | "创建 Issue"、"查看 Issue"、"搜索 Issue"、"更新 Issue"、"关闭 Issue"       | `create_issue`、`get_issue`、`list_issues`、`update_issue`                                                                                                                           |
| 场景五：提交历史分析          | "提交记录"、"提交历史"、"谁改了这个文件"、"commit history"、"查看 commit"  | `list_commits`、`get_commit`、`get_commit_diff`、`get_file_blame`                                                                                                                    |
| 场景六：流水线状态查询        | "流水线"、"pipeline"、"CI 状态"、"构建状态"                                | `list_merge_request_pipelines`、`list_commit_statuses`                                                                                                                               |
| 场景七：分支管理              | "创建分支"、"删除分支"、"保护分支"、"分支列表"                             | `list_branches`、`create_branch`、`delete_branch`、`protect_branch`、`get_branch`                                                                                                    |
| 场景八：仓库浏览与搜索        | "查看文件"、"项目目录"、"仓库文件"、"搜索代码"                             | `get_file_contents`、`get_repository_tree`、`search_repositories`、`create_or_update_file`                                                                                           |

---

## 场景一：代码提交与推送

此 Skill 有两种入口模式：

| 入口                 | 触发方式                                        | 行为                                                |
| -------------------- | ----------------------------------------------- | --------------------------------------------------- |
| **来自 jira-issues** | 修复 Bug 验证通过后，用户说"提交代码"           | 从阶段一开始，commit message 自动带 JIRA issue key  |
| **独立触发**         | 用户在会话中直接说"提交代码""推送代码""创建 MR" | 从阶段一或阶段二开始，commit message 由用户自行输入 |

### 阶段一：提交代码

**主动询问**用户是否提交代码。

#### 1.1 生成提交信息

- **来自 jira-issues 时**：从会话上下文中获取最近修复的 JIRA issue 信息（issue key、summary、type），根据项目 （见团队配置：三、Commit 规范） 规则自动生成：
  - **type**：根据 Jira issue type 映射（见团队配置：三、JIRA Issue Type → Commit Type 映射）
  - **description**：使用 issue 的 `summary`
  - **suffix**：`#<issue_key>`
  - 示例：`fix: 实时任务管理-查询条件placeholder与UI设计稿不一致 #（见团队配置：二、项目 Key）-2348`
- **独立触发时**：让用户自行输入 commit message

#### 1.2 确认并提交

将提交信息展示给用户确认。确认后执行：

```bash
git add <修改的文件>
git commit -m "<提交信息>"
```

> ⚠️ 使用 `ask_followup_question` 让用户选择：
>
> - "提交代码"
> - "跳过提交，稍后统一处理"

---

### 阶段二：推送代码

提交完成后，**主动询问**用户是否推送。

1. **显示当前分支** — 运行 `git branch --show-current`，告知用户当前所在分支
2. **选择分支** — 运行 `git branch`，用 `ask_followup_question` 让用户选择要推送的分支
3. **切换分支** — 运行 `git checkout <选定的分支>`
4. **拉取最新代码** — 运行 `git pull --rebase origin <分支名>`
   - 如果出现冲突，**立即停止**，提示用户手动解决冲突，不要自动处理
5. **推送代码** — 运行 `git push origin <分支名>`

---

## 场景二：创建 MR

推送完成后**主动询问**是否创建 MR，或用户直接说"创建 MR"。

### 步骤

1. **获取项目信息** — 运行 `git remote get-url origin` 获取仓库地址，调用 `list_projects`（search 用路径关键字）匹配项目，得到 `project_id`
2. **列出源/目标分支** — 调用 `list_branches`，用 `ask_followup_question` 让用户选择源分支（默认为当前分支）和目标分支
3. **列出项目成员** — 调用 `list_project_members`（参数 `include_inheritance=true` 以包含继承成员），获取成员列表（含用户名和 ID），用 `ask_followup_question` 让用户选择指派人（支持多选）

   > ⚠️ **指派人列表要求**：
   >
   > - **必须包含所有成员**：不得遗漏、筛选或跳过任何成员，即使是机器人账号也必须列出
   > - **必须包含当前用户**：当前用户（MR 创建者）应出现在选项中

4. **确认信息** — 汇总展示：

| 项目 | 源分支 | 目标分支 | 指派人 | MR 标题 |
| ---- | ------ | -------- | ------ | ------- |
| xxx  | xxx    | xxx      | xxx    | xxx     |

5. **创建 MR** — 调用 `create_merge_request`，参数：
   - `project_id`：项目 ID
   - `source_branch`：源分支
   - `target_branch`：目标分支
   - `title`：MR 标题
   - `assignee_ids`：指派人 ID 数组
6. **输出 MR 链接** — 展示创建的 MR URL

### 独立触发：仅推送代码

当用户只想推送（不创建 MR）时，仅执行场景一的阶段二，推送完成后提示用户。

---

## 场景三：MR 审查与 Code Review

当用户提到"审查 MR"、"review"、"Code Review"、"MR 改了什么"、"审批"、"合并"时触发。

### 3.1 查看待审查的 MR

1. 获取 `project_id`（参考项目识别章节）
2. 调用 `list_merge_requests`（state="opened"），按指定条件过滤：
   - 审查我的 MR → `reviewer_username` 设为当前用户（通过 `whoami` 获取）
   - 待我审批 → 结合 `approve_merge_request` 的权限
   - 指定作者 → `author_username`
   - 指定标签 → `labels`
3. 展示 MR 列表（标题、作者、源/目标分支、创建时间、状态）

### 3.2 查看 MR 详情

当用户指定某个 MR 时：

1. 调用 `get_merge_request`（`merge_request_iid`）获取 MR 详情
2. 展示 MR 概要：

```
## MR !<iid>：<title>

**作者**：xxx | **状态**：opened/merged/closed
**源分支**：xxx → **目标分支**：xxx
**创建时间**：xxx | **更新时间**：xxx
**描述**：...
```

### 3.3 查看代码变更

1. 调用 `list_merge_request_changed_files` — 先列出变更文件概览
2. 调用 `get_merge_request_diffs` — 查看具体代码 diff（可配合 `excluded_file_patterns` 排除无关文件，如 `["^vendor/", "package-lock\\.json$"]`）
3. 对关键变更进行分析：
   - 变更文件数量和类型（新增/修改/删除）
   - 关键逻辑变更点
   - 潜在的 Code Smell（大函数、重复代码、缺少错误处理等）

### 3.4 查看讨论

1. 调用 `mr_discussions` 获取 MR 所有讨论
2. 展示未解决的讨论（`resolved: false`），优先展示
3. 如有待回复的评论，提醒用户

### 3.5 MR 操作

根据上下文提供以下操作（用 `ask_followup_question` 确认）：

| 操作         | 说明                                             | MCP 工具                                      |
| ------------ | ------------------------------------------------ | --------------------------------------------- |
| **审批 MR**  | 调用 `approve_merge_request` 审批通过            | `approve_merge_request`                       |
| **撤销审批** | 调用 `unapprove_merge_request` 撤销已审批        | `unapprove_merge_request`                     |
| **添加评论** | 对 MR 整体添加评论                               | `create_merge_request_note`                   |
| **回复讨论** | 对特定讨论线程添加回复                           | `create_merge_request_discussion_note`        |
| **合并 MR**  | 代码审查通过后合并（先确认审批状态和流水线状态） | `merge_merge_request`                         |
| **更新 MR**  | 修改标题、描述、指派人、标签等                   | `update_merge_request`                        |
| **关闭 MR**  | 无需合并时关闭                                   | `update_merge_request`（state_event="close"） |

### 3.6 合并前检查清单

合并 MR 前，必须确认：

1. **审批状态** — 调用 `get_merge_request_approval_state` 确认审批通过
2. **流水线状态** — 调用 `list_merge_request_pipelines` 确认 CI 通过
3. **冲突状态** — 调用 `get_merge_request_conflicts` 确认无冲突
4. **讨论状态** — 调用 `mr_discussions` 确认无未解决的讨论

> ⚠️ 合并前用 `ask_followup_question` 让用户确认。

---

## 场景四：Issue 管理

当用户提到"创建 Issue"、"查看 Issue"、"搜索 Issue"、"更新 Issue"、"GitLab Issue"时触发。

> 💡 GitLab Issue 与 JIRA Issue 的区别：GitLab Issue 是项目级别的轻量级任务管理，JIRA Issue 由 Atlassian MCP 管理。本场景处理 GitLab 原生 Issue。

### 4.1 搜索/查看 Issue

1. 调用 `list_issues`，根据用户意图选择过滤条件：
   - 我创建的 → `scope="created_by_me"`
   - 分配给我的 → `scope="assigned_to_me"`
   - 所有 → `scope="all"`
   - 按标签 → `labels: ["bug", "enhancement"]`
   - 按状态 → `state: "opened" | "closed"`
   - 按里程碑 → `milestone: "v1.0"`
   - 按关键词搜索 → `search: "关键词"`
2. 展示 Issue 列表（标题、状态、标签、指派人、创建时间）
3. 用户指定后调用 `get_issue` 查看详情

### 4.2 创建 Issue

1. 向用户收集信息（缺少时询问）：
   - `title`（必需）
   - `description`（可选）
   - `labels`（可选，如 `bug`、`enhancement`、`documentation`）
   - `assignee_ids`（可选，需先 `list_project_members` 获取 ID）
   - `milestone_id`（可选，需先查里程碑）
   - `issue_type`（issue/incident/test_case/task，默认 issue）
2. 确认后调用 `create_issue` 创建
3. 展示创建结果和链接

### 4.3 更新 Issue

1. 先 `get_issue` 查看当前状态
2. 根据用户意图调用 `update_issue`，支持：
   - 修改标题/描述
   - 关闭/重开（`state_event: "close" | "reopen"`）
   - 分配指派人（`assignee_ids`）
   - 添加/修改标签（`labels`）
   - 设置截止日期（`due_date`）

### 4.4 Issue 讨论

- 调用 `list_issue_discussions` 查看讨论
- 调用 `create_issue_note` 添加评论

---

## 场景五：提交历史分析

当用户提到"提交记录"、"提交历史"、"谁改了这个文件"、"commit"时触发。

### 5.1 查看提交历史

调用 `list_commits`，根据用户意图过滤：

- 查看某个分支的提交 → `ref_name: "分支名"`
- 查看某段时间的提交 → `since` / `until`（ISO 8601 格式）
- 查看某个文件的提交 → `path: "src/xxx.vue"`
- 查看某人的提交 → `author: "用户名"`
- 包含文件变更统计 → `with_stats: true`

展示格式：

| SHA（短） | 作者 | 时间 | 标题 | 变更  |
| --------- | ---- | ---- | ---- | ----- |
| abc1234   | 张三 | 6-18 | xxx  | +5/-2 |

### 5.2 查看特定提交

调用 `get_commit`（`sha` + `stats: true`），展示：

- 完整提交信息（author、committer、时间、父提交）
- 文件变更统计（增/删行数）
- 如有需要，调用 `get_commit_diff` 查看具体 diff

### 5.3 文件变更追溯

调用 `get_file_blame` 查看文件每一行的最后修改者和提交：

- 用于定位"谁改了这一行"、"什么时候改的"

---

## 场景六：流水线状态查询

当用户提到"流水线"、"pipeline"、"CI"、"构建"时触发。

### 6.1 查看 MR 流水线

调用 `list_merge_request_pipelines`（需要 `project_id` + `merge_request_iid`）：

- 展示流水线列表（状态、分支、触发人、持续时间）
- 状态：running / pending / success / failed / canceled / skipped

### 6.2 查看 Commit 状态

调用 `list_commit_statuses`（需要 `project_id` + `sha`）：

- 展示该提交的所有 CI 状态（ESLint check、build check 等）

---

## 场景七：分支管理

当用户提到"创建分支"、"删除分支"、"保护分支"、"分支列表"时触发。

### 7.1 查看分支列表

调用 `list_branches`，支持 `search` 过滤。展示分支名、最近提交信息。

### 7.2 创建分支

1. 调用 `create_branch`（`branch` + `ref`）
2. `ref` 可以是分支名或 commit SHA，默认从当前分支创建

### 7.3 删除分支

调用 `delete_branch`（`branch` 参数为分支名）。

> ⚠️ 删除保护分支会失败，需先取消保护。

### 7.4 查看受保护分支

- `list_protected_branches` — 列出所有受保护分支
- `get_protected_branch` — 查看特定分支的保护规则
- `protect_branch` / `unprotect_branch` — 设置/取消保护

---

## 场景八：仓库浏览与搜索

当用户提到"查看文件"、"项目目录"、"仓库有什么"、"搜索代码"时触发。

### 8.1 浏览目录结构

调用 `get_repository_tree`（`path` 为空或不传查看根目录），展示文件和目录树。

### 8.2 查看文件内容

调用 `get_file_contents`（`file_path` + `ref` 指定分支/tag/commit），展示文件内容。

> 支持按指定 ref 查看历史版本的文件内容。

### 8.3 搜索代码

调用 `search_repositories`（`search` 参数为关键字），支持：

- 跨项目搜索代码
- 按文件扩展名过滤

### 8.4 直接编辑仓库文件

调用 `create_or_update_file`，参数：

- `file_path`：文件路径
- `content`：文件内容
- `commit_message`：提交信息
- `branch`：目标分支

> ⚠️ 此操作会直接创建 commit，适用于配置文件更新、文档修正等场景。需用户明确确认后才执行。

---

## 工具集激活

GitLab MCP 采用按需激活的工具集机制。当需要某类工具但未激活时，调用 `discover_tools` 激活对应 category：

| Category         | 包含的主要工具                                                                                                                                | 对应场景   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `merge_requests` | create/list/get/update MR, approve/unapprove, merge, discussions, diffs                                                                       | 场景二、三 |
| `issues`         | create/list/get/update issue, discussions, notes                                                                                              | 场景四     |
| `branches`       | list/create/delete/protect/unprotect branch                                                                                                   | 场景七     |
| `projects`       | list/search/get project, members, events                                                                                                      | 项目识别   |
| `repositories`   | get_file_contents, get_repository_tree, list_commits, get_commit, get_commit_diff, get_file_blame, search_repositories, create_or_update_file | 场景五、八 |
| `pipelines`      | list_merge_request_pipelines                                                                                                                  | 场景六     |
| `users`          | get_users, get_user, whoami                                                                                                                   | 场景二、四 |
| `labels`         | list/create/update/delete label                                                                                                               | 场景四     |
| `milestones`     | 里程碑相关工具                                                                                                                                | 场景四     |
| `releases`       | 发布版本相关工具                                                                                                                              | 发布管理   |
| `tags`           | 标签管理工具                                                                                                                                  | 标签管理   |
| `groups`         | list/search group, list_group_projects                                                                                                        | 项目识别   |

---

## 注意事项

- **Token 安全**：GitLab PAT 敏感度等同于密码，不要打印到对话输出中
- **冲突处理**：`git pull --rebase` 出现冲突时必须停止，让用户手动处理
- **commitlint**：commit message 格式必须符合项目 （见团队配置：三、Commit 规范）
- **project_id 复用**：同一会话内获取一次后复用，减少重复查询
- **工具未激活时**：调用 `discover_tools` 激活对应 category，不要手动尝试不存在的方法
- **合并 MR 前检查**：必须确认审批、流水线、冲突、讨论四项都通过
- **文件编辑谨慎**：`create_or_update_file` 会直接创建 commit，非必要不使用
