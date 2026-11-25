---
name: skill-family-docs-build-site
description: 公开文档站的核心信息架构设计、Markdown 创作、随产品变更增量刷新与纯渲染技能。面向外部使用者编写内容并调用六大原生组件，默认采用 shuorenhua 自然中文直接编辑；项目已声明 site 时，公开 API、CLI、配置或文档任务交付前也默认触发本技能评估知识站影响。
---

# 规划、创作、增量刷新与渲染文档站

`skill-family-docs-build-site` 负责把仓库内的真实代码、配置与使用步骤转化为结构清晰、易读易查的公开文档站。执行前先锁定本次操作模式（**首次建站**、**增量刷新**、**纯渲染重建** 或 **显式结构/模板调整**），严守对应模式的写入范围，不将纯渲染混同为内容改写。

## 四条不可妥协的写作与验收铁律

1. **100% 面向外部使用者写作（严禁改版日志与审计笔录外泄）**：
   - 以“第一次接触本工具或插件的外部开发者”为读者对象，围绕“能解决什么问题 → 怎么安装上手 → 常见场景怎么做 → 命令行与配置速查 → 报错怎么排障”展开；
   - 严禁把内部工程术语（内部版本锁、审计钩子、子智能体调度链路、制品图状态字段）写进公开文档；
   - **禁止改版日志外泄**：不得在面向新用户的指南或参考页写“不再像旧版那样……”“新版去掉了某某繁琐限制”“废除了某某机械统计”等内部迭代历史对比，直接正面写清当前合法用法；
   - **禁止审计笔录外泄**：不得把内部 QA 免责声明、版本取证台账、审批回执说明塞进用户教程。
2. **围绕真实操作顺序设计弹性章节结构**：
   - **首页（`index.md`）**：直接讲清解决什么问题 + 1 张浅/深色自适应工作流示意图（`::: diagram`）+ `::: steps` 三步跑通路径 + `::: cards` 核心能力导览卡片；
   - **快速上手（`quickstart.md`）**：精确的环境版本要求 + `::: tabs sync="host"` 多宿主联动安装命令 + ```` ```prompt ```` 第一条发给 AI 的对话提示词 + `::: file-tree` 目录结构预览 + 本地静态服务预览命令；
   - **场景指南页**：按产品真实使用场景拆页，不固定凑页数，不强求单段导语模板，且每一节若展示组件源码应紧接展示真实渲染效果；
   - **参考与排障页（`cli-and-config.md` 等）**：集中放置完整 CLI 参数表、退出码约定、配置字段说明与真实可触发报错的恢复步骤。
3. **善用六大原生文档组件并确保视觉自洽**：
   - 遵循 `references/components.md`，把宿主安装切换放进 `::: tabs sync="host"`，把 AI 对话指令放进 ```` ```prompt ````，把终端/JSON/YAML/JS 代码放进带语言标记的代码块，把操作流程放进 `::: steps`，把目录结构放进 `::: file-tree`，把提示与风险放进四色提示框或安全图表框；
   - 站内 `.svg` 图表必须支持浅色与深色双主题（使用透明/半透明底色或在 SVG `<style>` 中提供 `@media (prefers-color-scheme: dark)` 与 CSS 变量配色，严禁硬编码刺眼纯白背景 `<rect>`）；
   - 页面 `title`、卡片 `title`、图表 `title` 等纯文本属性不塞入未解析反引号；若正文提示读者“把尖括号里的内容换成……”，紧邻的 `prompt` 卡片中必须真实包含 `<...>` 占位符。
4. **源码级事实核实 + `shuorenhua` 自然中文编辑 + 真机双主题视觉走查**：
   - **动笔前强制核实真实契约**：必须先实跑目标 CLI `--help`（或等效帮助入口），并直接读取 CLI 参数解析源码、退出码定义、`package.json` 的 `engines.node` 及全部关联 JSON Schema。严禁凭猜测编造未实现的选项或退出码；文档内的 JSON 配置示例必须 100% 通过对应 JSON Schema 严格校验（严禁为规避 `@TOKEN@` 占位符检查而写出违反 Schema 正则的小写键名；正文需展示字面量时用 `\@TOKEN\@` 转义）；
   - 读取 `references/expression-registry.md`，通过 `agent-method-registry` 解析 `humanize-rewrite`——**默认推荐并采用 `shuorenhua` 直接按自然中文编辑原稿**（在项目根目录配置 `agent-methods.yaml` 指向 `shuorenhua`，直接讲清背景、条件、动作与结果，去掉自夸词、翻译腔与口语俚语）；若项目在 `agent-methods.yaml` 中显式配置了其他合法实现则严格遵循，遇配置损坏或方法缺失时立即停止并保留原稿；
   - **区分静态抽检与真机视觉走查**：`--check-layout` 仅执行纯 Node.js 静态 HTML/CSS 容器溢出分析（零浏览器依赖）。**完成首次建站、整站改版或新增图表/组件后，必须在真实浏览器中完成“浅色 + 深色双主题 × 390px 手机 / 1440px 笔记本 / 2560px 宽屏”视觉走查**，逐项确认深色图表对比度、`>=1920px` 宽屏 `1560px` 外框下正文保持 `780px` 行宽、`prompt` 卡片左侧靛蓝紫竖条与徽章辨识度、Callout/标题代码芯片、`Steps` 圆环与首行文字居中、短行内 `code` 与极简 `#` 标题锚点悬停浮现、`⌘K` 搜索命中 `<mark>` 高亮、右侧目录 Scrollspy 触底跟手度及底部分页完整性。
5. **独立公开文档站 `-site` 命名与三处显式 Pages 入口规程**：
   - 所有新建独立公开静态文档仓统一命名为 `<owner>/<id>-site`，使用 `main:/` 部署静态产物并按 `site-v{version}` 打发布标签（严禁使用 `-doc`、`-docs`、`-pages`、`-wiki` 等不统一后缀；仅历史存量仓可显式声明 `legacySiteRepoAllowlist: true` 豁免）；
   - 在 `public-release.json` 的 `repos[].site` 中配置 `publicSiteRepo`（如 `"<owner>/<id>-site"`）与 `pagesUrl`（如 `"https://<owner>.github.io/<id>-site/"`；多包工作区同时通过 `publicReadmePaths` 列出全部公开包 `README.md` / `README.zh-CN.md`）；
   - 所有关联公开插件仓与 npm 包必须在三处同步放置完整的 `pagesUrl` 在线文档入口：① GitHub 仓库右侧 `About -> Website (homepageUrl)`、② `package.json#homepage`、③ 公开 `README.md` 首屏显著位置，并关停旧的插件仓内重复 GitHub Pages。

## 四类操作模式

### 1. 首次建站
1. 若项目尚未配置 `public-release.json` 的 `site` 字段，先调用 `skill-family-docs-setup` 完成零写入诊断、计划展示与获批接线。
2. 依据项目真实使用场景规划简洁的 `pages.json`（填写 `site: { title, tagline, version? }`、`groups` 与 `pages: [{ id, title, navTitle?, summary?, group }]`）。
3. 核实 CLI `--help`、参数源码、退出码与 Schema 后编写全站 `<id>.md` 及深色自适应 SVG/图表，按 `shuorenhua` 自然中文编辑与首次使用者冷读核收写定 `site.dir`。
4. 依次运行覆盖刷新、站点渲染、三项只读机械门禁与真实浏览器双主题视觉走查：

```bash
npx skill-family-doc-render@0.7.0 --refresh-coverage --repo <name>
npx skill-family-doc-render@0.7.0 --repo <name>
npx skill-family-doc-render@0.7.0 --check-project --repo <name>
npx skill-family-doc-render@0.7.0 --check-layout --repo <name>
npx skill-family-doc-render@0.7.0 --check-stale-limits --repo <name>
```

### 2. 增量刷新（含公开 API/CLI 变更交付前默认影响判断）
1. 读取 Git 暂存、未暂存与未跟踪变化（如项目启用 `artifact-graph` 一并读取变更上下文），运行 `npx skill-family-doc-render@0.7.0 --status --repo <name>` 查看覆盖落后与变化文件清单。
2. 判断变化是否影响外部用户可见行为：
   - **影响用户行为**：实跑新 CLI `--help` 并核对源码差异，仅更新受影响的 `<id>.md` 页面（保留既有页面 URL、分组顺序与稳定 `{#id}` 锚点），经 `shuorenhua` 自然中文编辑与冷读核收后写回 `site.dir`，随后刷新覆盖快照、重新渲染并复跑全部只读门禁（涉及图表或组件改动时补做浏览器双主题走查）；
   - **仅属内部重构且用户用法未变**：保留原有文档正文不变，记录核对依据，仅刷新 `site-coverage-lock.json` 并确认 `--check-project` 通过。
3. 若用户明确要求“整篇重写”，仍基于同一组已核实源码事实重塑表达并保留原有页面 ID 与对外锚点。

### 3. 纯渲染重建
用户明确要求“只重新渲染”或“按现有 Markdown 重建页面”时，仅执行确定性渲染与只读检查，**不改动任何 `.md` 正文、`pages.json` 或 `site-coverage-lock.json`**。若此时覆盖快照已落后，正常完成静态页面重建并如实提示“静态产物已按现有源重建，内容覆盖仍待审阅”。

### 4. 显式结构调整或模板升级
仅当用户明确要求增删页面、调整导航目录、改用 `markdown-v2` + `modern` 模板或升级 `skill-family-doc-render` 版本时执行：先向用户对照展示新旧页面 URL 与锚点变化（尽量保留兼容锚点），再更新 `public-release.json` / `pages.json`、重渲并核查全站链接与浏览器双主题视觉效果。

## 本地预览与失败恢复

- 预览生成的静态站点时，优先启动只读 HTTP 服务访问 `site.target`（例如 `python3 -m http.server -d docs/public/rendered 8080`；避免使用会往 HTML 注入随机属性的预览工具，若使用须先复制到仓外临时目录再预览）。
- 当 `--check-project`、`--check-layout` 或 `--check-stale-limits` 失败时，原样保留错误原因与退出码，结合实际失败阶段定位修复：内容漏更或存在虚构参数/悬空提示时回改 `.md` 并刷新覆盖，HTML 漂移时重新运行渲染，配置或 Schema 违规时修正 `public-release.json` / `pages.json`，绝不手改生成目录下的 `.html` 或 `site-baseline.json`。

<!-- @feature DOC1 @scenario S-01 S-02 S-03 -->
