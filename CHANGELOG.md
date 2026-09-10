# 变更日志

## 0.4.4 - 2026-09-10

### 改进

- setup 会展开并核对覆盖模式，保留合法但尚未跟踪的产品输入，并排除缓存、日志、安装依赖和生成物等不稳定内容。
- render-site 与 style-guard 改用同一条实际使用场景说明适用条件、必要输入、操作入口、成功结果和失败恢复。架构说明只在读者需要选择入口或定位故障时展开。
- 收敛 Claude Code 的技能发现路径，继续保持根技能与 Claude、Codex、Kimi、WorkBuddy 四份 adapter 的成员和字节一致。
- 四类插件清单与平台清单统一更新为 0.4.4。

## 0.4.3 - 2026-09-09

### 修复

- 为 WorkBuddy 与 CodeBuddy 增加插件根目录 `skills/` 投影，并让 CodeBuddy 插件清单直接指向该目录。WorkBuddy 桌面端的斜杠菜单不读取自定义 adapter 路径；此次修复让六个已加载技能也能作为斜杠入口显示。
- `check:adapters` 现在逐文件核对根目录投影与 WorkBuddy adapter 的成员和字节，防止兼容投影演变为第二事实源。

## 0.4.2 - 2026-09-09

### 修复

- `skill-family-docs-quickstart` 选择目标技能后会在同一轮调用它，不再只返回技能名。业务判断和完成标准仍由目标技能负责。
- `skill-family-docs-render-site` 禁止把正式输出传给可能写回文件的预览工具。需要这类工具时先复制到仓库外的临时目录，预览后再把只读项目检查作为最后一步。
- `skill-family-docs-style-guard` 接受 `NOTE`、`TIP` 和 `WARNING` 三种 Markdown 提示块标记，仍会拦截提示块正文中的感叹号。
- `skill-family-docs-setup` 优先复用项目已经精确安装的命令行工具，并用完整结构化读取或完整文件搜索证明接线缺失，避免截断读取造成误判。

### 变更

- 工作区使用的 `artifact-graph` 升级到 0.12.0，`release-skill` 升级到 0.9.16。渲染器及其 Foundation 0.18.0 依赖不变。
- 包清单、四份插件清单与四份平台清单统一更新为 0.4.2。

## 0.4.1 - 2026-09-07

### 新增

- 新增 Claude Code 与 Codex 插件清单及 adapter。两个新 adapter 与 Kimi、WorkBuddy 继续共享同一组六技能，style-guard 的脚本和参考资料也保持逐字节一致。
- `check:adapters` 通过 Foundation 0.18.0 的 `describeHost` 和 `verifyHostPeers` 核验 Claude Code、Codex、Kimi Code、WorkBuddy 四个宿主及其权威路径分类。

### 变更

- 包清单、四份插件清单与四份平台清单统一更新为 0.4.1。README 增加四宿主经 Skill Family Hub 安装本版本的入口。

## 0.4.0 - 2026-09-07

### 变更

- 六个技能转向 `markdown-v1` 和包内 `editorial` 模板。新站由 `pages.json` 管理分组目录、页面职责和教程顺序，项目不再编写主题 CSS 或页面 JavaScript。
- `skill-family-docs-setup` 保留默认只读诊断；只有用户明确要求接入或准备并接线时，才补齐当前项目的本地配置，并保留既有文档检查。
- `skill-family-docs-render-site` 分开首次生成、内容刷新、纯渲染和显式结构或模板升级。普通刷新保留目录与模板，纯渲染不更新正文或覆盖快照。
- 发布前恢复提示统一指向 `skill-family-doc-render --check-project --repo <name>` 的实际输出。发布钩子只读阻断，不调用 LLM 改正文。
- `check:adapters` 新增版本一致性检查。包版本、Kimi 与 CodeBuddy 插件清单、Kimi 与 WorkBuddy 平台清单必须一致。

## 0.2.1 - 2026-09-07

### 变更

- `skill-family-docs-render-site` 把知识站影响判断纳入日常任务收尾。未建站项目先经 setup 只读诊断再创建，已有站点按 Git 变化、artifact-graph 上下文、覆盖状态、语义判断、风格审校、覆盖刷新、渲染和最终检查的顺序增量更新。新工作流说明 `site.versionSources`、`site.coverage`、覆盖快照和 status/refresh 退出码合同。
- `skill-family-docs-style-guard` 的确定性检测器支持直接读取 HTML。它从 `<main>` 抽取正文，排除导航、页脚、样式、脚本和代码区，并把命中定位到原 HTML 行号。Markdown 行为与既有规则保持不变。
- 渲染器 0.3.0 发布后统一使用该精确版本。安装和 npx 示例不再引导用户获取缺少新合同的旧版本。

## 0.2.0 - 2026-09-05

发布坐标：tag `skill-family-docs-v0.2.0`。

### 不兼容变更

四个技能从 0.1.1 的裸名改为携带插件前缀的名称：

- `help` → `skill-family-docs-help`
- `render-site` → `skill-family-docs-render-site`
- `style-guard` → `skill-family-docs-style-guard`
- `site-design` → `skill-family-docs-site-design`

0.2.0 不保留旧名称的兼容别名。已有调用、说明或自动化需要改用右侧的新名称。

### 新增

- 新增两个标准公共入口，kimi 与 workbuddy 两平台同名文件逐字节一致：
  - `skill-family-docs-setup`：只读环境就绪检查（安装闭包、Node 与 CLI 可用性、
    `public-release.json`、站点源、渲染前置条件）。不安装、不写配置、不渲染、不发布。
  - `skill-family-docs-quickstart`：意图路由，指向 help / setup / render-site /
    style-guard / site-design。只路由，不承载执行生命周期。

### 变更

- 移除插件仓自带的 `.claude-plugin/marketplace.json`。Kimi Code、CodeBuddy 与
  WorkBuddy 统一通过 `ifoohoo/skill-family-hub` 发现插件；插件仓只保留平台清单和
  插件载荷。

- 六个入口按冻结架构收敛为三个标准入口（`help`、`setup`、`quickstart`）和三个业务入口
  （`render-site`、`style-guard`、`site-design`）。Kimi 与 WorkBuddy 保留两份真实 adapter
  目录；共享载荷不替代 CodeBuddy 的独立宿主验收，也不增加第三份 adapter。
- Foundation 三包精确采用 0.18.0；渲染器与插件协同使用 Node.js `>=22.22.2 <23`。
- Audit 814 尚未完成全量审计，局部审阅结果不构成正式全量认证。

## 0.1.1 - 2026-08-12

### 变更

- 分发切换为 bundled-family：插件仓自带 `.claude-plugin/marketplace.json`，codebuddy 市场消费改为经该市场文件 rerouting（提交 `51b708f`、`90ed2c1`）。

## 0.1.0 - 2026-08-12

### 新增

- 初始版本：kimi + workbuddy 双平台插件，help / render-site / style-guard / site-design 四技能，style-guard 附纯 Node 检测器 `scripts/check-style.mjs`。
