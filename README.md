# skill-family-docs

`skill-family-docs` 是面向 Claude Code、Codex、Kimi Code 与 WorkBuddy / CodeBuddy 的公开知识站技能插件。它让 Agent 用受限 Markdown 准备项目、首次生成知识站、按产品变化刷新内容，或只按现有源重新渲染。

插件不包含渲染实现。精确版本的 npm 包 `skill-family-doc-render` 读取 `public-release.json`，使用包内 `editorial` 模板生成完整 HTML、CSS、静态搜索和浏览器交互。LLM（大语言模型）只更新有来源支持的正文。

## 六个技能

- `skill-family-docs-help`：提供能力总览和最短使用路径。
- `skill-family-docs-setup`：默认只读诊断。只有用户明确要求接入项目或准备并接线时，才补齐当前项目的本地配置。
- `skill-family-docs-quickstart`：只做意图路由，不执行业务流程。
- `skill-family-docs-render-site`：处理首次生成、内容刷新、纯渲染，以及显式的目录调整或模板升级。
- `skill-family-docs-style-guard`：用事实、理解和表达三道检查审校中文正文。
- `skill-family-docs-site-design`：验收 `editorial` 模板的导航、阅读、搜索、复制、主题、键盘和窄屏体验。

四个宿主使用各自的 adapter 目录。六个同名技能及 style-guard 的配套文件必须逐字节一致。`npm run check:adapters` 同时检查四份载荷闭包、逻辑映射，以及包版本与四份插件清单、四份平台清单的版本一致性。

## 使用路径

只读检查环境时，调用 `skill-family-docs-setup`。首次接入时，明确说明“接入项目并接线”；setup 只补缺项，整站正文交给 `skill-family-docs-render-site`。

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

以下命令在 `public-release.json` 所在目录运行，用于渲染、只读项目检查、读取覆盖状态和刷新覆盖快照：

```bash
skill-family-doc-render --repo <name>
skill-family-doc-render --check-project --repo <name>
skill-family-doc-render --status --repo <name>
skill-family-doc-render --refresh-coverage --repo <name>
```

内容刷新会根据 Git 变化、制品上下文和覆盖状态判断读者影响。它只修改相关 Markdown，保留页面 ID、分组、顺序和模板。纯渲染不修改正文或覆盖快照。

未声明 `site.format` 的旧项目仍使用旧格式兼容路径。只有显式迁移请求才修改格式、清单或模板。

## 风格检测器

style-guard 附带一个纯 Node 检测器，可以检查 Markdown 和旧 HTML `<main>` 正文：

```bash
node adapters/kimi/skills/skill-family-docs-style-guard/scripts/check-style.mjs 稿件.md 页面.html
```

硬禁命中退出 1，输入错误退出 2，其余退出 0。脚本只报告，不改稿件；退出 0 不代表事实正确或已经完成读者任务冷读。

## 安装与版本边界

仓库中的 `package.json` 是插件本地源版本。它不能证明该版本已发布、已被 Hub 登记或已安装到宿主。目标版本完成发布、通过验证，并由 Skill Family Hub 接受登记后，才可声称该版本能从 Hub 获取；宿主是否生效仍以安装记录为准。

当前源包版本为 0.4.1，八份插件和平台清单与它保持一致。该表述不构成发布或宿主生效证据。

完成上述发布和登记后，Claude Code 可从 Skill Family Hub 安装 0.4.1：

```text
/plugin marketplace add ifoohoo/skill-family-hub
/plugin install skill-family-docs@skill-family-hub
```

Codex 使用同一个 Hub：

```bash
codex plugin marketplace add ifoohoo/skill-family-hub
codex plugin add skill-family-docs@skill-family-hub
```

Kimi Code 先添加 Hub，再从插件浏览器安装 `skill-family-docs@0.4.1`：

```text
/plugins marketplace https://raw.githubusercontent.com/ifoohoo/skill-family-hub/main/kimi-marketplace.json
```

CodeBuddy 也使用同一 Hub：

```bash
codebuddy plugin marketplace add ifoohoo/skill-family-hub
codebuddy plugin install skill-family-docs@0.4.1
```

WorkBuddy 桌面端从插件面板添加同一市场并安装该版本。站点渲染器是独立 npm 包；项目需要 CLI 时精确安装本版配套候选：

```bash
npm install --save-exact skill-family-doc-render@0.4.1
```

## 最小示例

插件安装后，可以在项目任务中直接描述目标。以下请求先检查环境，只读运行，不会修改项目：

```text
请使用 skill-family-docs-help 说明知识站能力，并告诉我应该从哪个入口开始。
```

确定入口后，可使用 `skill-family-docs-setup` 检查当前项目的知识站环境是否就绪。需要首次接入时明确写入意图，例如“请使用 skill-family-docs-setup 接入当前项目并接线”。接入完成后，再调用 `skill-family-docs-render-site` 生成第一版知识站。

## 故障诊断

- 插件安装后不可见时，先确认目标版本已经由 Hub 接受登记，再核对宿主安装记录和平台清单指向的 adapter 路径。
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

四个 `adapters/*/skills/` 目录是手写载荷。改动后运行 `npm run check:adapters`，不用其中一份的通过结果代替其他宿主的真实安装验收。

<!-- release-skill:capability:safe-first-command -->
> 安全起点：调用 `skill-family-docs-setup` 做只读诊断。该模式不安装依赖，不改配置，不渲染，也不刷新覆盖快照。

<!-- release-skill:capability:external-write-boundary -->
> 外部写入边界：插件不发布软件，不安装或更新宿主。用户明确要求本地接入时，setup 只修改当前项目的授权配置；站点产物只由渲染包写入 `public-release.json` 声明的 `site.target`。

Apache-2.0，详见 [LICENSE](LICENSE)。
