# 六大原生文档组件与现代 Markdown 写法参考

`skill-family-doc-render@0.7.0`（`format: "markdown-v2"` / `template: "modern"`，并自动兼容存量 `markdown-v1` / `editorial`）支持完整标准 Markdown（多级嵌套列表、任务列表、GFM 表格对齐、删除线、普通引用块、水平分隔线、`{#custom-id}` 稳定锚点），以及以下 6 类面向 AI 技能族文档的专属组件。

## 1. 全站偏好记忆的多宿主切换标签组（`::: tabs`）

用 `sync="host"` 声明后，读者在全站任意页面切换选定某个宿主（如 `Codex` 或 `Antigravity`），站内所有同组标签同步切换并由浏览器记住选择；关闭 JS 时自动平铺展开各标签标题与正文，保证无脚本阅读。

```markdown
::: tabs sync="host"
::: tab Claude Code
\`\`\`bash
/plugin install my-plugin@skill-family-hub
\`\`\`
:::
::: tab Codex
\`\`\`bash
codex plugin add my-plugin@skill-family-hub
\`\`\`
:::
::: tab Kimi
\`\`\`bash
/plugins marketplace https://example.com/kimi.json
\`\`\`
:::
::: tab WorkBuddy
在应用内插件市场搜索并安装 `my-plugin`。
:::
::: tab Antigravity
安装 `my-plugin` 根级插件并重启窗口。
:::
:::
```

若只需当前区块局部切换、不联动全站，省略 `sync="host"` 写成 `::: tabs` 即可。

## 2. AI 对话提示词卡片 vs 静态高亮代码块

两类代码块在视觉上彻底分离：

- **`prompt` 对话提示词卡片**：使用 ```` ```prompt ```` 或 `::: prompt ... :::`，渲染为带左侧靛蓝紫竖条、柔和靛蓝染色底板、鲜明 `发给 AI 助手的对话提示词` 顶栏胶囊徽章与舒适阅读字体的专属卡片，自动按宽度折行。
- **终端与代码高亮块**：使用 ```` ```bash ````、```` ```sh ````、```` ```json ````、```` ```yaml ````、```` ```js ````、```` ```ts ````、```` ```markdown ```` 等语言标记，内置零外部依赖静态语法着色器与一键复制按钮。

## 3. 序号连线步骤流（`::: steps`）

将操作流程的 `###` 标题（可选 `{#id}` 稳定锚点）或有序列表放入 `::: steps` 中，渲染为左侧带序号圆环与竖向引导线的步骤流：

```markdown
::: steps
### 第一步：初始化配置 {#step-init}
在根目录声明 `public-release.json`。

### 第二步：撰写页面并渲染 {#step-render}
运行 `npx skill-family-doc-render@0.7.0`。
:::
```

## 4. 能力导览卡片网格（`::: cards`）

适合放在首页或分流页面，渲染为响应式悬浮微抬升卡片网格；支持 `title`、`href`（站内相对链接、锚点或外部 HTTPS 链接）、`icon`（`rocket`、`shield`、`sparkles`、`terminal`、`layers`、`book`、`wrench`、`zap`、`compass`、`check`）与可选 `badge`：

```markdown
::: cards
::: card title="快速上手" href="quickstart.html" icon="rocket" badge="3 分钟"
安装插件并发出第一条建站提示词。
:::
::: card title="防泄漏门禁" href="update-and-gates.html" icon="shield"
发版前自动拦截本机绝对路径与凭据。
:::
:::
```

## 5. 目录结构可视化树（`::: file-tree`）

用缩进列表配合 `# 说明` 编写目录树，自动识别文件夹与文件图标并右对齐解释文字：

```markdown
::: file-tree
- docs/public/ # 公开站点根目录
  - site/
    - pages.json # 导航与页面清单
    - index.md # 产品总览
  - rendered/ # 静态生成产物（勿手改）
    - index.html
:::
```

## 6. 四色语义提示框与图表内嵌（`::: tip/info/warning/danger` 与 `::: diagram`）

- **四色提示框**：支持容器写法（`::: tip`、`::: info`、`::: warning`、`::: danger`，后可接自定义标题）以及 GFM 引用块写法（`> [!TIP]`、`> [!INFO]`、`> [!NOTE]`、`> [!WARNING]`、`> [!DANGER]`），内部支持多段正文、列表和代码块。
- **图表内嵌（`::: diagram`）**：仅引用站内 `assets/` 目录下的安全 `.svg` 流程图或独立沙箱化的 Archify `.html` 交互图，渲染带放大查看弹窗与新窗口打开按钮的图表框：

```markdown
::: diagram src="assets/diagrams/workflow.svg" title="文档站生成与门禁流水线" :::

::: diagram src="assets/diagrams/architecture.html" title="交互式系统架构图" height="460" :::
```

站点正文严禁嵌入原始 `<script>`、`<iframe>`、`on*` 事件属性或一级 `#` 标题（一级标题由 `pages.json` 的 `title` 唯一生成）。
