# 变更日志

## 0.2.0 - 未发布

本地候选：已包含下列变化，尚未发布。安装示例必须使用精确版本 `@0.2.0`；当前
`.release-skill/project.yaml` 对本 release unit 仍是 `distributions: []`，本轮只准备 GitHub
公开镜像与 Hub-only 发布表面。当前没有真实 Kimi / CodeBuddy 分发证明，后续 Hub 提案仍需
另行授权。

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
