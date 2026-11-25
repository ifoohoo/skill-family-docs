---
name: skill-family-docs-check-site
description: 公开文档站的独立只读质量门禁与视觉体验验收技能。核验代码/CLI/退出码/Schema 事实零失真、站内链接与锚点可达、静态版面与 SVG 深色适配、解码后无私密路径或凭据泄漏、无过时限制词或虚构选项，并执行真机双主题×三视口视觉核收；全程只读，不修改正文或刷新覆盖锁。
---

# 只读检查与视觉体验验收

`skill-family-docs-check-site` 负责在发版前或改完文档后执行独立只读体检。**全程只读**：不修改 `site.dir/*.md`、`pages.json`、`site-coverage-lock.json` 或 `site.target`（仅在显式要求 `--conclusion-output` 时排他新建一份证明文件）。

## 一、核心机械门禁链路

在 `public-release.json` 所在目录依次运行三项只读检查：

```bash
# 1. 输入与正文机械合同、-site 仓库命名与公开 README 显式 Pages 入口、解码防泄漏、覆盖快照、渲染基线、站内链接与锚点
npx skill-family-doc-render@0.7.0 --check-project --repo <name>

# 2. 纯 Node.js 静态 HTML/CSS 版面溢出抽检（默认 320,390,768,1280 四档像素宽度）与 SVG 纯白底色深色刺眼检测
npx skill-family-doc-render@0.7.0 --check-layout --repo <name>

# 3. 技能指令与公开文档中的过时限制词、失效内部引用及 CLI 虚构选项拦截
npx skill-family-doc-render@0.7.0 --check-stale-limits --repo <name>
```

需要出具或读取本族机械证明时，使用对应互斥参数（读取旧证明不要求当前目录存在 `public-release.json`）：

```bash
npx skill-family-doc-render@0.7.0 --check-project --repo <name> --conclusion-output /absolute/path/conclusion.json
npx skill-family-doc-render@0.7.0 --read-proof --proof-root /absolute/proof-root --proof relative/conclusion.json
```

## 二、必查事实核对与真机双主题×三视口视觉核收清单

机械门禁退出码 `0`（其中 `--check-layout` 仅为纯 Node.js 静态 HTML/CSS 分析）不能替代代码事实逐项比对与真实浏览器感知验收。发版、首版建站、整站改版或新增图表/组件后，必须完成以下两类核收：

### 1. 代码、CLI 与 Schema 事实逐项核对（必查）
- **CLI 选项与退出码零虚构**：实跑目标 CLI `--help`，对照参数解析源码、`engines.node` 与退出码定义，逐行核对文档中的所有命令调用、参数表首列、组合规则与退出码表，确认无虚构参数、无遗漏必填前置选项（如 `--repo`）、无编造退出码。
- **配置示例 100% 合法可复制**：核对文档中的 `public-release.json`、`pages.json` 等 JSON/YAML 示例块符合对应严格 Schema（如 `versionSources` 键名符合 `^@[A-Z0-9_]+@$`），且排障条目对应真实可触发的报错信息。
- **纯粹外部视角与自然母语**：确认正文无 `TODO` / `TBD` 占位符、无悬空替换提示、无本机绝对路径与凭据，且**零改版日志外泄**（不写“不再像旧版……”等内部改造对比）、**零审计笔录外泄**（不塞入内部免责套话或取证台账）、零自夸词与生硬翻译腔。
- **独立公开文档仓 `-site` 命名与三处显式 Pages 入口**：核对新建独立公开静态文档仓命名为 `<owner>/<id>-site`（`main:/` 部署静态产物，打 `site-v{version}` 标签；除显式声明 `legacySiteRepoAllowlist: true` 的历史存量仓外严禁 `-doc`、`-docs`、`-pages`、`-wiki` 后缀），且所有关联公开插件仓与 npm 包均已在 ① GitHub 仓库右侧 `About -> Website (homepageUrl)`、② `package.json#homepage`、③ 公开 `README.md`（含 `publicReadmePaths` 指定的全部公开包 `README`）首屏显著位置同步放置完整 `https://` `pagesUrl` 链接，旧的插件仓内重复 Pages 已关停。

### 2. 真机浏览器“浅色 + 深色双主题 × 390px / 1440px / 2560px”视觉核收清单（必查）
通过只读静态服务（如 `python3 -m http.server -d docs/public/rendered 8080`，严禁使用会改写 `site.target` 正式文件的插桩预览工具）在真实浏览器中覆盖**浅色 + 深色双主题**与 **`390px` 手机 / `1440px` 笔记本 / `2560px` 宽屏**三档视口，逐项确认：

1. **SVG 图表深色底色与宽屏/窄屏版面**：浅/深色切换及 `⌘K` 遮罩下，站内 SVG 图表、`.diagram-body` 与放大预览弹窗均无刺眼纯白方块；`>=1920px` 宽屏下 `.doc-shell` 与顶栏对齐放宽至 `1560px` 且中间正文列保持 `780px` 阅读行宽；`<=640px` 窄屏下宽流程图可在容器内平滑横向滑动或放大查看，整页无横向滚动条。
2. **Callout、提示词卡片与各级标题代码芯片**：`prompt` 提示词卡片具备左侧靛蓝紫竖条、柔和靛蓝底板与鲜明顶栏徽章，与终端代码块一眼区分；Callout 标题、章节标题、卡片标题与图注中的行内代码均渲染为 `<code>` 代码芯片，无裸露反引号；深色模式下 `tip` / `info` / `warning` / `danger` 四色提示框边框透明度与视觉权重均衡。
3. **`Steps` 序号基线对齐**：`.doc-step` 左侧数字圆环与右侧同行 `h3` 标题首行文字垂直中线对齐，竖向引导线连贯无错位。
4. **行内 `code`、极简 `#` 标题锚点与表格首列断行**：正文中短行内 `code`（如文件名、容器指令）不在连字符或空格处碎裂跨行，`h2`–`h5` 右侧极简 `#` 锚点在桌面指针悬停或键盘聚焦时平滑浮现、在无悬停触屏设备保持半透明可点，点击后复制完整章节链接并触发勾选态与 Toast；表格首列参数不碎裂，同时超长路径在 `320px` / `390px` 窄屏下自动折行、零溢出。
5. **Toast 深色对比度与锚点聚焦态**：点击复制代码或复制章节链接后，右下角 Toast 在浅色与深色主题下均有清晰对比度（深色下不闪纯白底）；点击章节锚点或从搜索框跳转后，标题不出现横跨全宽的紫色聚焦框，键盘 `Tab` 导航交互控件时 `:focus-visible` 清晰可见。
6. **`⌘K` 搜索命中高亮与右侧目录 Scrollspy 跟手度**：搜索结果使用 `<mark>` 高亮匹配关键字，页面级入口与子章节入口摘要区分明确、不重复千篇一律；从页首滚动至页尾最底部时，右侧 `本页内容` 目录能逐节准确激活直至最后一节。
7. **底部分页与无 JS 降级完整性**：底部 `← 上一篇 / 下一篇 →` 翻页链条完整（含第二页返回首页总览入口）；禁用浏览器脚本时，正文、折叠目录、平铺标签面板与翻页链接依然完整可用。

## 三、失败定位与报告格式

- 门禁报错（退出码 `1` 或 `2`）或视觉核收发现瑕疵时，原样保留失败阶段、文件行号、视口/主题条件与退出码，指明回到 `skill-family-docs-build-site` 修正源文件或模板并重新渲染，绝不直接手改生成物或提前刷新覆盖锁来转绿。
- 汇报结论时清晰列出：`执行命令与退出码`、`机械门禁各项核验结果`、`代码事实与双主题×三视口真机视觉核收结果（若受环境限制未能执行真机浏览器视觉检查，必须显式声明未执行，不得声称已完成视觉验收）` 及 `建议修复动作`。

<!-- @feature DOC1 @scenario S-01 S-02 -->
<!-- @feature DOC2 @scenario S-04 S-05 -->
