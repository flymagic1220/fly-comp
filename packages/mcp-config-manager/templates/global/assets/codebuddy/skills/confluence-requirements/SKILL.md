---
name: confluence-requirements
description: 从 Confluence 获取需求文档，支持通过页面 ID 或 URL 获取页面、在空间中搜索、列出页面树结构，并将 Confluence 存储格式转换为 Markdown。当用户需要获取 PRD、技术规格或任何 Confluence 中的开发文档时使用。
---

# Confluence 需求文档获取工具

> **团队配置**：本 Skill 依赖 `../team-config.md` 中的以下配置项：
>
> - 六、MCP 服务器 → Atlassian (Jira + Confluence)

通过 Atlassian MCP Server（`atlassian`）从 Confluence 获取需求文档和技术规格。

## 前置条件

`atlassian` MCP Server 已配置，包含 Confluence 工具集。检查 `mcp.json` 中 `atlassian` 的 `CONFLUENCE_URL` 和 `CONFLUENCE_PERSONAL_TOKEN` 是否已正确填写。

## 可用工具

| 工具                             | 用途                                                           |
| -------------------------------- | -------------------------------------------------------------- |
| `confluence_search`              | CQL 全文搜索，按关键词/空间/标签查找页面                       |
| `confluence_get_page`            | 获取页面详情，支持 `convert_to_markdown: true` 自动转 Markdown |
| `confluence_get_page_children`   | 获取子页面列表                                                 |
| `confluence_get_space_page_tree` | 获取空间页面树结构                                             |
| `confluence_get_comments`        | 获取页面评论                                                   |
| `confluence_get_page_history`    | 获取页面版本历史                                               |
| `confluence_get_page_diff`       | 比较页面版本差异                                               |

## 使用流程

### 搜索页面

```
confluence_search(query="关键词", limit=10)
```

如需限定空间，使用 CQL 语法：

```
confluence_search(query="space = \"SPC\" AND text ~ \"关键词\"", limit=10)
```

**搜索结果的确认流程（重要）**：当 `confluence_search` 返回多个结果时：

1. 将搜索结果以清晰的列表展示给用户（包含序号、标题、空间、最后修改时间）
2. 用 `ask_followup_question` 让用户选择目标文档（支持多选）
3. 对每个选中的页面依次调用 `confluence_get_page` 获取完整内容

如果只返回 1 个结果，直接获取。

### 获取页面

```
confluence_get_page(page_id="123456", convert_to_markdown=true)
```

> 使用 `convert_to_markdown: true`，内容直接返回 Markdown 格式，无需额外转换。

### 获取子页面

```
confluence_get_page_children(parent_id="123456")
```

### 获取页面评论

```
confluence_get_comments(page_id="123456")
```

### 内容保存

MCP 返回 Markdown 内容后，手动保存到文件。在 `requirement-to-plan` 工作流中：

```
write_to_file(filePath="$DEMAND_DIR/PRD.md", content=<MCP 返回的 Markdown>)
```

## CQL 搜索技巧

- `text ~ "关键词"` — 全文搜索
- `space = "KEY"` — 限定特定空间
- `type = "page"` — 仅搜索页面（不含博客）
- `title ~ "PRD"` — 按标题搜索
- `label = "requirement"` — 按标签搜索
