# skill-family-docs

多平台技能插件（kimi + workbuddy/codebuddy）：公开文档站的规划、写作、设计与渲染方法论。Apache-2.0，通用方法论，不含任何私有路径或业务数据。

## 它是什么

skill-family 生态的公开插件，教 agent 完成公开文档站的四件事：**规划**站点信息架构、**写**中文技术内容、**设计**站点视觉、**跑**渲染与校验。插件本身不含渲染实现——渲染由 npm CLI 包 `skill-family-doc-render` 完成（配置驱动的 GitHub Pages 知识站渲染器，读项目的 `public-release.json`，把 `docs/public/site/` 渲染成带导航 / 翻页 / 页脚的完整站点，写盘前做内容级泄漏扫描）。本插件描述它的配置契约与工作流，不替代它。

## 六个技能

- **skill-family-docs-help**：入口导览。六个技能各管什么、何时用哪个、与 npm 包的关系、最小上手示例。
- **skill-family-docs-setup**：只读环境就绪检查——安装闭包、Node 与 CLI 可用性、`public-release.json`、版本源与 release unit 的一致性、站点源目录、渲染前置条件。不安装、不写配置、不渲染、不发布。
- **skill-family-docs-quickstart**：意图路由入口，按用户意图指到 help / setup / render-site / style-guard / site-design 之一；只路由，不承载执行生命周期。
- **skill-family-docs-render-site**：`public-release.json` 配置（`site.dir/target/pages/tokens`）、`docs/public/site/` 源结构（`pages.json` + `id.html` + `<!--NAV-->` / `<!--PAGER-->` / `<!--FOOTER-->` 注入点 + `@{NAME}_TAG@` / `@{NAME}_VERSION@` 版本占位符）、导航分层设计原则、内容完整性清单、渲染与 `--check` 基线校验工作流。项目任务交付前默认判断知识站影响：未建站先经 setup 只读诊断再创建，已有站点则根据 Git 和 artifact-graph 上下文增量更新。
- **skill-family-docs-style-guard**：中文技术文档写作风格守卫，三道门——事实门（无材料不开长篇、禁 TODO 注水）、可读性门（句长变异、连词密度、长句率、术语首现解释）、风格门（硬禁清单 + 警告层）。附纯 Node 检测器 `scripts/check-style.mjs`，可直接检查 Markdown 或 HTML `<main>` 正文，只报不改，硬禁命中退出 1：

  ```bash
  node adapters/kimi/skills/skill-family-docs-style-guard/scripts/check-style.mjs 稿件.md
  node adapters/kimi/skills/skill-family-docs-style-guard/scripts/check-style.mjs 页面.html
  ```

  HTML 检查排除导航、页脚、样式、脚本和代码区，诊断保留原 HTML 行号。退出 0 只表示未命中确定性硬禁，不代表文章已经容易读懂。

- **skill-family-docs-site-design**：公开文档站 UI 指南——版式、可读性与可访问性、`assets/style.css` 定制约束（allowlist：html/css/js/svg，配图用自绘 SVG）、渲染后视觉自检清单（深色 / 浅色、窄屏、打印、键盘）。

kimi 与 workbuddy 是两份真实、手写的 adapters，六个同名技能文件逐字节一致。它们证明
各自目录的载荷闭包，不证明 CodeBuddy 的真实宿主资格。CodeBuddy 与 WorkBuddy 是不同
宿主；共享插件载荷不等于共享宿主验收结果。本版本不增加第三份 adapter。

六个入口分成三个标准入口和三个业务入口：`help`、`setup`、`quickstart` 负责说明、只读
就绪检查和意图路由；`render-site`、`style-guard`、`site-design` 分别承载站点渲染、中文
文档审校和视觉设计验收。后三个业务入口都接受自然语言目标或已明确的参数，两种表面汇合
到同一工作流。

## 安装

以下命令只有在目标版本完成发布、通过验证，并由 Skill Family Hub 接受登记后才会安装到该版本。仓库中的候选代码或 GitHub Release 本身，不能证明 Hub 已经提供这个版本。

### kimi

先在 Kimi Code 中添加 Skill Family Hub：

```
/plugins marketplace https://raw.githubusercontent.com/ifoohoo/skill-family-hub/main/kimi-marketplace.json
```

添加后从插件浏览器安装 `skill-family-docs@0.2.1`。插件仓库仍是载荷真源，Hub 只维护
市场索引。

### workbuddy / codebuddy

CodeBuddy 与 WorkBuddy 统一从 Skill Family Hub 安装：

```bash
codebuddy plugin marketplace add ifoohoo/skill-family-hub
codebuddy plugin install skill-family-docs@0.2.1
```

WorkBuddy 桌面端添加同一市场后，从插件面板安装 `skill-family-docs@0.2.1`。

未来实际分发时，CodeBuddy 的发现路径、登录态和真实宿主验收需要单独核验；WorkBuddy 的
目录验证结果仍不证明 CodeBuddy 资格。本轮 Hub-only 的 release-prepare 不运行 Kimi / CodeBuddy
distribution 或消费者门禁。Audit 814 的规则尚未完成全量审计，局部通过记录不能表述为
正式全量认证或 `READY_FOR_RELEASE`。

## 目录结构

```
packages/skill-family-docs/
  package.json                    # private，仅作版本源
  .kimi-plugin/plugin.json        # kimi 平台清单
  .codebuddy-plugin/plugin.json   # codebuddy/workbuddy 平台清单
  adapters/
    kimi/skills/                  # skill-family-docs-help / -setup / -quickstart / -render-site / -style-guard / -site-design
    workbuddy/skills/             # 同上，内容一致
  README.md
  LICENSE                         # Apache-2.0
```

## 许可

Apache-2.0，见 [LICENSE](LICENSE)。

<!-- release-skill:capability:safe-first-command -->
> **从这里开始：** 对一篇草稿运行风格检测器——`node adapters/kimi/skills/skill-family-docs-style-guard/scripts/check-style.mjs 稿件.md`。
> 它只读稿件、只报告问题、不改任何文件；六个技能的 SKILL.md 本身也都是纯阅读材料。

<!-- release-skill:capability:external-write-boundary -->
> **外部写边界：** 本插件只含方法论文档与一个只读检测器，不执行任何网络、git 或凭据操作。
> 站点渲染写盘由 npm 包 `skill-family-doc-render` 完成，其写盘范围以被渲染项目自己的
> `public-release.json` 声明的站点目标目录为界（收容 + 原子写 + 写前泄漏扫描）。

## 最小示例

```text
/plugins marketplace https://raw.githubusercontent.com/ifoohoo/skill-family-hub/main/kimi-marketplace.json
# 从 Kimi Code 插件浏览器安装 skill-family-docs
# 安装后意图不明时进 skill-family-docs-quickstart 路由；要确认环境先跑 skill-family-docs-setup；
# 其余按路由进入 skill-family-docs-help / -render-site / -style-guard / -site-design
```

## 配套 CLI

站点渲染由 npm 包完成：`npm install --save-exact skill-family-doc-render@0.3.0`。日常安全第一命令是
只读校验 `npx skill-family-doc-render@0.3.0 --check`。该包要求 Node.js `>=22.22.2 <23`，
并精确采用 `skill-family-contracts@0.18.0`、`skill-family-harness-node@0.18.0` 与
`skill-family-engineering-kit@0.18.0`。

持续更新需要两组 `site` 配置：

```json
{
  "versionSources": {
    "@COMPONENT_VERSION@": { "source": "package.json", "pointer": "/version" },
    "@COMPONENT_TAG@": { "source": "package.json", "pointer": "/version", "prefix": "component-v" }
  },
  "coverage": {
    "lock": "site-coverage-lock.json",
    "inputs": ["package.json", "src/**", "docs/public/site/**"]
  }
}
```

`site.versionSources` 的值形态是 `{source, pointer, prefix?, suffix?}`，版本源文件会自动加入覆盖输入。setup 会把 `repo.source + versionSources.<token>.source` 与对应 release unit 的 `source + version.source` 规范化后比较，冲突时停止，不自动改配置。

`--status --repo <name>` 只读检查覆盖：一致退出 0，快照缺失或落后退出 1，未配置 coverage 或其他工具配置错误退出 2。`--refresh-coverage --repo <name>` 在语义判断与风格审校后刷新快照。两个命令都必须指定 `--repo`。快照只保存输入文件摘要、聚合摘要和可选的 `artifactGraphVersionLockSha256`。

## 故障排查

- 如果渲染失败，先看退出信息：配置不合法或泄漏扫描命中都会以非零退出并给出具体文件位置。
- `--check` 报漂移时，重跑渲染刷新基线并核对 diff；确认是源改动导致后再提交产物。
- 技能安装后不可见时，确认平台清单指向的 `adapters/<平台>/skills/` 路径存在。
