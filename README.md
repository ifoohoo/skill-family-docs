# skill-family-docs

`skill-family-docs` 是面向 Claude Code、Codex、Kimi Code 与 WorkBuddy / CodeBuddy 的公开知识站技能插件。它让 Agent 用受限 Markdown 准备项目、首次生成知识站、按产品变化刷新内容，或只按现有源重新渲染。

插件不包含渲染实现。精确版本的 npm 包 `skill-family-doc-render` 读取 `public-release.json`，使用包内 `editorial` 模板生成完整 HTML、CSS、静态搜索和浏览器交互。起草与刷新通过 style-guard 的脚本拟稿流程完成：宿主整理事实和读者任务、审核大纲，再顺序拟稿并传入已接受前文；全文通过事实、理解、图文和硬禁核对后才写入。安装者自行选择 OpenAI 兼容服务、模型和 key 的环境变量来源。缺配置、调用失败或候选未接受时保留原稿，报告表达优化未完成。纯渲染和发布检查不调用模型。0.6.0 已分发可配置脚本；主流程替换已随 0.6.1 正式发布并分发。

## 六个技能

- `skill-family-docs-help`：提供能力总览和最短使用路径。
- `skill-family-docs-setup`：先只读诊断；缺项可安全处理时，展示精确计划和影响并询问是否执行。用户明确同意已展示且复核未漂移的计划后，才补齐当前项目的本地配置。
- `skill-family-docs-quickstart`：按用户意图选择目标技能，并在同一轮把请求交给目标技能继续执行；它不重复目标技能的业务逻辑。
- `skill-family-docs-render-site`：处理首次生成、内容刷新、纯渲染，以及显式的目录调整或模板升级。
- `skill-family-docs-style-guard`：组织材料、审核大纲、调用脚本顺序拟稿，并核对接受稿的事实、理解与表达。
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

需要配置起草、刷新或整篇重写使用的表达服务时，可调用 `skill-family-docs-setup`。站点接入与表达服务配置需分别检查。起草、刷新或整篇重写操作依赖表达服务配置；仅重新渲染、机械检查、读取证明、覆盖检查与刷新、治理及发布检查无需模型配置。

请用户自行选择 OpenAI 兼容服务的 base URL（基础地址）与模型，并在自己的 shell 中配置以下三项。示例地址与模型名仅用于说明格式，必须替换为用户选定的值；第三项仅为存放 API key 的环境变量名，非 key 本身。

```bash
export SKILL_FAMILY_DOCS_ENDPOINT='https://api.example.com/v1'
export SKILL_FAMILY_DOCS_MODEL='your-selected-model'
export SKILL_FAMILY_DOCS_CREDENTIAL_ENV='MY_DOCS_API_KEY'
```

实际 API key 应由用户在自己的 shell 或已有安全来源中设置并导出至 `MY_DOCS_API_KEY`；若使用其他变量名，需同步更新第三项。严禁将 key 发送至聊天、写入项目文件或日志，亦不可作为命令行参数传入。`setup` 不读取认证文件或用户级模型配置，不自动编辑 shell 配置，也不从 `LLM_*` 环境变量自动补齐三项。服务与模型不绑定默认值或特定提供者。

`setup` 在当前进程检查三项配置与所引用的 key 是否存在、非空，以及凭据变量名是否合法；结果只显示检查项状态，不显示任何变量值。该检查不联网、不读取文稿、不写文件，也不验证服务可达性、key 有效性或模型可用性。表达配置缺项只阻断起草、刷新与整篇重写，不阻断纯渲染或治理检查。

临时 `export` 仅影响当前 shell 及其后续启动的子进程。用户自行修改可信的 shell 配置后，需重新加载该配置；已启动的宿主进程不会自动继承新配置。退出宿主后从已配置的环境重新启动，或按宿主正常方式重启并核对实际进程配置。仅新开任务无法保证环境已更新。

本地配置齐全不表示已完成模型调用；首次真正外发仍由 `skill-family-docs-style-guard` 说明材料将发送至所配置服务，并沿既有授权与候选核收流程执行。

style-guard 另附纯 Node 检测器，检查 Markdown 和旧 HTML `<main>` 正文：

```bash
node adapters/kimi/skills/skill-family-docs-style-guard/scripts/check-style.mjs 稿件.md 页面.html
```

硬禁命中退出 1，输入错误退出 2，其余退出 0。脚本只报告，不改稿件；退出 0 不代表事实正确或已经完成读者任务冷读。

## 安装与版本边界

`package.json` 中的版本号仅表示本地源包版本，不能证明该版本已正式发布、由 Skill Family Hub 登记，或已在宿主中生效。目标版本完成发布、通过验证，并由 Skill Family Hub 接受登记后，方可声称可从 Hub 获取；宿主是否加载仍以实际安装记录为准。

当前本地源包及四份插件清单、四份平台清单均处于 0.6.7 本地候选状态。npm 查询对象为 `skill-family-doc-render`，已观测 npm latest 为 `0.6.6`；文档插件自身已观测 GitHub 标签为 `skill-family-docs-v0.6.6`，但插件本身不是 npm 分发对象。`0.6.7` 仍为三单元本地联合候选，所有宿主的 0.6.7 原生交付尚未完成验收，本地测试结果不可替代正式验证。

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
