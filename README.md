# skill-family-docs

`skill-family-docs` 是面向 Claude Code、Codex、Kimi Code 与 WorkBuddy / CodeBuddy 的公开知识站技能插件。它让 Agent 用受限 Markdown 准备项目、首次生成知识站、按产品变化刷新内容，或只按现有源重新渲染。

插件不包含渲染实现。精确版本的 npm 包 `skill-family-doc-render` 读取 `public-release.json`，使用包内 `editorial` 模板生成完整 HTML、CSS、静态搜索和浏览器交互。

`skill-family-docs-style-guard` 在起草、内容刷新或显式整篇重写时，将完整原稿、核实材料、读者任务、编辑范围及用户裁决交由独立上下文的中文编辑子智能体处理。该编辑者调用已安装的 `humanize-rewrite` 共享入口，通过方法注册与解析组件 `agent-method-registry` 确认项目选择的方法，读取返回的 `skillPath` 所指向的实现并执行。默认实现为 `chinese-humanize-rewrite`，实际调用 Qwen 组织文稿；显式覆盖时可选择其他已安装实现，每次仅执行所选一项，不串联或自动融合。

编辑者返回完整候选文稿、实际解析结果、执行方式及语义核对结果。文档技能族 Docs 负责公开材料范围、页面身份、技术事实和图文信息。负责当前文档任务的主调用方对照技术事实通读全文，核对条件、例外、限制、命令、版本、引用、页面身份与图文信息，并完成验收。主调用方验收通过后，才由 `render-site` 沿既有路径写入站点源目录 `site.dir`。编辑者接受候选文稿，不能代替这次验收。

## 六个技能

- `skill-family-docs-help`：提供能力总览和最短使用路径。
- `skill-family-docs-setup`：先只读诊断；缺项可安全处理时，展示精确计划和影响并询问是否执行。用户明确同意已展示且复核未漂移的计划后，才补齐当前项目的本地配置。
- `skill-family-docs-quickstart`：按用户意图选择目标技能，并在同一轮把请求交给目标技能继续执行；它不重复目标技能的业务逻辑。
- `skill-family-docs-render-site`：处理首次生成、内容刷新、纯渲染，以及显式的目录调整或模板升级。
- `skill-family-docs-style-guard`：派发独立中文编辑者解析共享方法，并核对接受稿的事实、理解与表达。
- `skill-family-docs-site-design`：验收 `editorial` 模板的导航、阅读、搜索、复制、主题、键盘和窄屏体验。

Claude Code 与 WorkBuddy / CodeBuddy 从插件根目录的 `skills/` 加载六个技能，Codex 与 Kimi Code 从各自 adapter 路径加载，加载路径保持不变。六技能正文的唯一编辑源为 `packages/skill-family-docs/skills`，技能正文修改必须在此路径进行。四份 adapter 目录下的 `skills/` 为生成副本，由 `npm run build:adapters` 显式生成，包含 style-guard 配套脚本与参考资料，不得手工修改或新增 `skills-src`。

开发维护者在修改后，需在开发工作区根目录运行 `npm run build:adapters` 生成副本，随后立即执行 `npm run check:adapters` 进行只读核验。该检查比对根 `skills` 与四适配器副本的技能载荷、逻辑映射，以及包版本与四份插件清单、四份平台清单的版本一致性，不生成、不修复、不自愈。构建与检查不修改平台 `manifest`，不安装宿主，不发布，不替代真实宿主安装与业务验收。

> 已安装插件的消费者无需运行任何开发命令，仅需通过正常安装流程使用已发布能力。

## 使用路径

不确定入口时，调用 `skill-family-docs-quickstart` 并直接描述目标。它会在同一轮选择并调用目标技能，不会只返回技能名。检查环境或首次接入时，也可以直接调用 `skill-family-docs-setup`。setup 先区分环境就绪、接入缺项、站点内容待处理、自定义工具链冲突或前提不足；需要写入时，它会列出官方核实的精确版本、当前包管理器命令、文件影响、不会执行的动作和成功信号，再询问是否执行。整站正文仍交给 `skill-family-docs-render-site`。

新站的 `public-release.json` 显式选择内容格式和模板：

```json
{
  "site": {
    "dir": "docs/public/site",
    "target": "docs/public/rendered",
    "pages": "pages.json",
    "format": "markdown-v1",
    "template": "editorial"
  }
}
```

该片段不代替项目的版本源和覆盖输入。`pages.json` 保存站点元数据、导航分组、页面 ID、标题、职责、版式和顺序；正文保存在 `<id>.md`。模板负责站点样式和脚本，项目不自定义 CSS、JavaScript 或 HTML 组件。

在 `public-release.json` 所在目录运行扫描、渲染、覆盖状态和刷新覆盖快照的命令时，以下 `0.6.0` 命令为历史用法示例，不代表当前推荐组合或建议安装版本。请先通过[支持范围](#support-scope)确认已验证的插件与渲染器组合，实际调用前仍须核实 `skill-family-doc-render@0.6.0` 在官方 npm 中可用。已发布 0.4.5 版本不支持 `--conclusion-output` 和 `--read-proof` 两个参数。

```bash
npx skill-family-doc-render@0.6.0 --repo <name>
npx skill-family-doc-render@0.6.0 --check-project --repo <name>
npx skill-family-doc-render@0.6.0 --check-project --repo <name> --conclusion-output /absolute/path/conclusion.json
npx skill-family-doc-render@0.6.0 --status --repo <name>
npx skill-family-doc-render@0.6.0 --refresh-coverage --repo <name>
```

读取旧证明使用同一精确版本，可在任意工作目录运行：

```bash
npx skill-family-doc-render@0.6.0 --read-proof --proof-root /absolute/proof-root --proof relative/conclusion.json
```

`--check-project` 只做机械检查：输入与公开安全、覆盖、内存渲染与磁盘基线、内部链接和资源。它不靠重新渲染让检查通过，也不执行目标脚本或 hook。项目还没有网站配置时，扫描停在现有失败原因，不会初始化或建站。只有同时给出 `--conclusion-output` 时才排他写入一份共同证明；不带该参数时不额外写文件。

`--read-proof` 只用调用方给出的 proof-root 和该根内相对路径读取本族证明。它不读 `public-release.json`，不要求站点配置，也不重新扫描目标。旧证明只记录原目标当时的结论。

这两类命令互斥。刷新证明会重新检查，并把新文件写到新路径；旧文件保留。整改、渲染写入和建站仍要单独授权。

渲染器证明只覆盖机械范围。链接检查通过不能代替中文语义审阅。记载未通过、未完成或未能开展检查的证明，结论保持为未通过。本地候选已经做过的出证和读证，仍只覆盖当时的机械范围。发布、Hub 登记和四个宿主的新回复以官方记录为准。

内容刷新会根据 Git 变化、制品上下文和覆盖状态判断读者影响。它只修改相关 Markdown，保留页面 ID、分组、顺序和模板。纯渲染不修改正文或覆盖快照。

未声明 `site.format` 的旧项目仍使用旧格式兼容路径。只有显式迁移请求才修改格式、清单或模板。

## 表达服务与辅助检测器

`humanize-rewrite` 是独立技能族提供的共享中文编辑入口，首次接入可从公开坐标 [ifoohoo/humanize-rewrite v0.1.0](https://github.com/ifoohoo/humanize-rewrite/tree/v0.1.0) 获取依赖，市场与插件名称均为 `humanize-rewrite`。

Codex 用户依次执行两条命令，先执行 `codex plugin marketplace add ifoohoo/humanize-rewrite`，再执行 `codex plugin add humanize-rewrite@humanize-rewrite`。Claude Code 用户通过标准插件市场添加与安装流程，使用同一公开项目与同名插件。

安装完成后，调用已安装的 `humanize-rewrite-setup` 检查运行依赖与所选实现的模型配置。开发维护者可继续使用本地可核验工作区或个人链接，首次用户无需寻找相邻私有工作区。

默认方法为 `chinese-humanize-rewrite`，当项目未通过 `agent-methods.yaml` 显式覆盖时启用。若存在该文件，用户可指定 `shuorenhua` 或其他已安装的合法实现；方法被禁用、配置无效、方法缺失或指向错误入口时，系统将停止执行，不回退至默认方法，且保留已有合法选择及其他注册项。Registry 根据默认目录和项目覆盖配置解析所选实现。

配置由所选实现决定：`chinese-humanize-rewrite` 默认使用 `LLM_BASE_URL` 和 `LLM_API_KEY`，默认模型为 `qwen3-30b-a3b-instruct-2507`；可选开启开放式审阅，通过 `READABILITY_REVIEW_*` 配置项控制。Docs 不再使用旧的 `SKILL_FAMILY_DOCS_*` 配置模型。检查只报告变量是否配置，不显示变量值或密钥。表达配置检查在本地完成，不调用模型，不外发文稿内容；站点接入可联网查询官方分发版本，因此整个 setup 并非离线操作。环境变量需在宿主启动进程时继承，变更后未生效时应重载配置并重启宿主。分别报告方法是否解析成功、模型配置是否齐全、真实改写是否完成；安装或检查完成不能当作改写完成。

当共享入口缺失、Registry 解析失败、所选方法运行异常或候选文稿未被接受时，系统保留原始文稿，并报告“表达优化未完成”及具体原因。入口或解析有问题时，使用安装检查技能 `humanize-rewrite-setup`，在授权范围内恢复入口或修正注册、配置；方法运行失败或候选未被接受时，交回同一编辑者处理完整段落或小节，不得绕过禁用状态或错误的项目覆盖配置调用默认方法，也不得由主会话自行改写冒充独立编辑。

候选文稿须经编辑者核对，并由主调用方完成领域验收后，才可沿既有路径正式写入站点正文。失败期间不提前刷新覆盖快照，不宣称首次生成、刷新或整篇重写已完成。

纯渲染仅根据已有源内容重建产物，不做任何内容修改，不调用表达模型，不覆盖快照。即使快照已落后，仍可重建，但必须明确提示“仍需内容审阅”。机械检查通过不能替代中文语义验收。

style-guard 另附纯 Node 检测器，检查 Markdown 和旧 HTML `<main>` 正文：

```bash
node adapters/kimi/skills/skill-family-docs-style-guard/scripts/check-style.mjs 稿件.md 页面.html
```

硬禁命中退出 1，输入错误退出 2，其余退出 0。脚本只报告，不改稿件；退出 0 不代表事实正确或已经完成读者任务冷读。

## 安装与版本边界

`package.json` 中的版本号仅表示本地源包版本，不能证明该版本已正式发布、由 Skill Family Hub 登记，或已在宿主中生效。目标版本完成发布、通过验证，并由 Skill Family Hub 接受登记后，方可声称可从 Hub 获取；宿主是否加载仍以实际安装记录为准。

版本信息以 `package.json`、插件清单、平台清单及 `CHANGELOG` 为准，上述文件记录源码状态与变更内容，但不构成正式发布、Hub 登记或宿主环境生效的证明。实际发布状态请查询官方分发记录，Hub 登记状态请查阅平台登记信息，宿主环境加载状态请核对安装日志与运行时加载记录。

本地源码存在、已安装、已加载与已发布是不同状态，不能仅凭版本号或目录存在推断其发布与可用性。Registry 自动解析仅支持 Codex（`codex`）与 Claude Code（`claude-code`）两种宿主身份，该支持不等同于实际改写任务已验证。

`Kimi` 与 `WorkBuddy` 保持原有渲染能力，不可冒用其他宿主身份，亦不可宣称中文编辑流程已通过验证。四个宿主的技能文件内容一致，不代表实际调用均已验证。在 Codex 和 Claude Code 中执行编辑任务时，仍需分别核对技能入口、宿主提供的子智能体工具及实际执行结果。

<a id="support-scope"></a>

### 支持范围

截至 2026-10-18，本次 macOS 环境中已记录的业务验证使用 `skill-family-docs` 插件 0.6.5 与 `skill-family-doc-render` 渲染器 0.6.5 的组合。这些记录只涵盖限定任务，不能据此认定各宿主的全部业务均已通过。

| 宿主 | 实际结果 |
| --- | --- |
| Codex | 当前原生会话完成首次接入、首次生成、公开变化刷新、同事实整篇重写、无变化保留、覆盖落后纯渲染和浏览器体验；非独立新CLI进程验证 |
| Claude Code 2.1.233 | 原生进程执行 `help`、只读审校和检查；`--check` 退出码 0；`--check-project` 因覆盖落后退出 1，项目未通过完整检查 |
| CodeBuddy CLI 2.158.0 | 原生进程执行 `help`、只读审校和检查；`--check` 退出码 0；`--check-project` 因覆盖落后退出 1，项目未通过完整检查 |
| Kimi Code 2.2.0 | 加载插件 0.6.5 后执行 `help` 和只读审校；纯渲染业务验证中发现 Git 索引变化，只读边界失败；无法归因具体命令或进程；本地修复未随 0.6.5 交付 |
| WorkBuddy Desktop 5.8.3 | 插件 0.6.5 已安装并被发现读取，实际调用越过只读边界，受影响业务已暂停；CodeBuddy CLI 结果不能替代桌面端验收 |

所有矩阵之外的组合尚未验证，不等于不支持。升级、暂留 0.6.5 或回退前，须核对插件、渲染器及宿主的匹配组合与已知限制。暂留或回退不会消除 0.6.5 组合的已知限制。回退操作及回退后组合均未实测。

### 历史安装示例

本 README 保留 0.6.0 版本的安装与 CLI 示例说明，用于记录历史用法，不代表当前推荐组合。0.6.0 曾正式发布并由 Hub 登记。带 `@0.6.0` 的精确命令可固定版本；未固定版本的市场命令实际取得的版本需核实安装记录。

Claude Code 可从 Skill Family Hub 安装插件：

```text
/plugin marketplace add ifoohoo/skill-family-hub
/plugin install skill-family-docs@skill-family-hub
```

Codex 使用同一个 Hub：

```bash
codex plugin marketplace add ifoohoo/skill-family-hub
codex plugin add skill-family-docs@skill-family-hub
```

Kimi Code 先添加 Hub，再从插件浏览器安装 `skill-family-docs@0.6.0`：

```text
/plugins marketplace https://raw.githubusercontent.com/ifoohoo/skill-family-hub/main/kimi-marketplace.json
```

CodeBuddy 也使用同一 Hub：

```bash
codebuddy plugin marketplace add ifoohoo/skill-family-hub
codebuddy plugin install skill-family-docs@0.6.0
```

WorkBuddy 桌面端从插件面板添加同一市场并安装该版本。安装或升级后重启客户端，即可在斜杠菜单中直接选择六个技能入口。站点渲染器是独立 npm 包。项目需要 CLI 时，先在官方 npm 确认 `skill-family-doc-render@0.6.0` 可用，再精确安装：

```bash
npm install --save-exact skill-family-doc-render@0.6.0
```

## 最小示例

插件安装后，可以在项目任务中直接描述目标。以下请求先检查环境，只读运行，不会修改项目：

```text
请使用 skill-family-docs-help 说明知识站能力，并告诉我应该从哪个入口开始。
```

确定入口后，可使用 `skill-family-docs-setup` 检查当前项目的知识站环境是否就绪。需要首次接入时可以说“请使用 skill-family-docs-setup 接入当前项目并接线”。这句话启动接入事务，不授权执行尚未展示的计划；setup 会先只读检查并展示影响，用户明确同意该计划后才写入。接入配置完成后，再调用 `skill-family-docs-render-site` 生成第一版知识站。

## 故障诊断

- 插件安装后不可见时，先确认目标版本已经由 Hub 接受登记，再核对宿主安装记录、插件清单的技能根路径和对应平台清单。
- setup 报依赖或版本冲突时，按实际 Node 约束和项目精确版本修正；不要把本地候选当作已发布版本。
- `--check-project` 报覆盖落后、正文问题、渲染漂移或坏链时，先读取具体原因，再选择内容刷新、纯渲染或配置修正；不要直接修改生成的 HTML。
- 渲染命令退出 2 时，检查配置与输入合同；退出 1 时处理报告的状态问题。失败会保留既有正式输出和基线。

## 目录结构

```text
packages/skill-family-docs/
  package.json
  .claude-plugin/plugin.json
  .codex-plugin/plugin.json
  .kimi-plugin/plugin.json
  .codebuddy-plugin/plugin.json
  skills/
  adapters/
    claude/platform-manifest.json
    claude/skills/
    codex/platform-manifest.json
    codex/skills/
    kimi/platform-manifest.json
    kimi/skills/
    workbuddy/platform-manifest.json
    workbuddy/skills/
  README.md
  CHANGELOG.md
  LICENSE
```

根 `skills/` 是唯一编辑源，四份 `adapters/*/skills/` 是生成副本。所有适配器目录下的 `skills/` 由 `build:adapters` 从唯一编辑源显式生成，内容与根路径保持逐字节一致。维护者应依据前文规则操作，不修改生成文件，不新增 `skills-src`。

<!-- release-skill:capability:safe-first-command -->
> 安全起点：调用 `skill-family-docs-setup`。它先只读诊断；缺项可安全处理时展示精确计划和影响，再询问是否执行。授权前不安装依赖，不改配置，不渲染，不刷新覆盖快照，也不写 MEMORY、缓存或宿主持久状态。

<!-- release-skill:capability:external-write-boundary -->
> 外部写入边界：插件不发布软件，不安装或更新宿主。用户明确同意 setup 已展示且复核未漂移的计划后，setup 只修改计划内的当前项目配置；站点产物只由渲染包写入 `public-release.json` 声明的 `site.target`。

Apache-2.0，详见 [LICENSE](LICENSE)。
