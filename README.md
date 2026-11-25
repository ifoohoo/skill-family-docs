# skill-family-docs

`skill-family-docs` 是面向 Claude Code、Codex、Kimi Code、WorkBuddy（含 CodeBuddy）与 Antigravity 的五宿主公开文档站技能族插件。它帮助智能体用现代 Markdown 与 6 大原生组件完成环境接入、面向外部读者的文档站构建、随产品变化增量更新以及只读质量门禁验收。

在线文档（GitHub Pages）：<https://ifoohoo.github.io/skill-family-doc-render-site/>

插件自身不内嵌渲染代码，底层由精确版本的 npm 包 `skill-family-doc-render@0.7.0` 驱动：`format: "markdown-v2"` 与 `template: "modern"` 提供现代三栏响应式界面、多宿主记忆切换标签、AI 提示词卡片 vs 静态语法高亮代码块、序号步骤流、卡片网格、目录结构树、`?v=<sha8>` 内容指纹防缓存、解码后防泄漏扫描与只读质量检查（存量 `markdown-v1` 与 `editorial` 自动平滑映射至新引擎）。

## 五个技能入口

| 技能 | 定位与职责 |
| --- | --- |
| `skill-family-docs-help` | 5 个技能的分工导览、使用路径与 CLI 协作边界 |
| `skill-family-docs-quickstart` | 统一意图路由入口，识别接入 / 建站更新 / 纯渲染 / 只读检查并在同一轮直接加载目标技能 |
| `skill-family-docs-setup` | 零写入环境与仓库探测，生成简洁的 `public-release.json` + `pages.json` 接入方案，获批后落盘配置 |
| `skill-family-docs-build-site` | 核心创作与增量刷新技能：100% 面向外部使用者写作、按真实任务设弹性章节、善用 6 大原生组件、经 `agent-method-registry` 默认采用 `shuorenhua` 自然中文直编并冷读核收，再执行渲染并按需刷新 `site-coverage-lock.json` |
| `skill-family-docs-check-site` | 独立只读质量门禁技能：核查代码事实漂移、站内链接与锚点、多视口零横向溢出、解码后私密路径/凭据防泄漏、过时限制词与覆盖基线 |

### 宿主加载与同步规则

Claude Code、WorkBuddy / CodeBuddy 与 Antigravity（通过根级 `plugin.json`）直接从插件根目录 `skills/` 加载；Codex 与 Kimi Code 从各自 `adapters/<host>/skills/` 加载。开发工作区中 `packages/skill-family-docs/skills` 是唯一手写源，四份 `adapters/*/skills/` 由 `npm run build:adapters` 自动同步，再由 `npm run check:adapters` 只读核对五套清单版本、映射与字节一致性。

## 日常配置与检查命令

新站点在 `public-release.json` 中简洁声明：

```json
{
  "site": {
    "dir": "docs/public/site",
    "target": "docs/public/rendered",
    "pages": "pages.json",
    "format": "markdown-v2",
    "template": "modern",
    "publicSiteRepo": "your-org/my-plugin-site",
    "pagesUrl": "https://your-org.github.io/my-plugin-site/"
  }
}
```

`pages.json` 只需声明 `site: { title, tagline?, version? }`、`groups: [{ id, title }]` 与 `pages: [{ id, title, navTitle?, summary?, group }]`，不再强制填写 `role` / `kind` / `inPager` 枚举。

在 `public-release.json` 所在目录运行渲染、覆盖管理与只读质量门禁：

```bash
npx skill-family-doc-render@0.7.0 --repo <name>
npx skill-family-doc-render@0.7.0 --check-project --repo <name>
npx skill-family-doc-render@0.7.0 --check-project --repo <name> --conclusion-output /absolute/path/conclusion.json
npx skill-family-doc-render@0.7.0 --check-layout --repo <name>
npx skill-family-doc-render@0.7.0 --check-stale-limits --repo <name>
npx skill-family-doc-render@0.7.0 --status --repo <name>
npx skill-family-doc-render@0.7.0 --refresh-coverage --repo <name>
```

只读读取本族共同证明（不要求 `public-release.json`）：

```bash
npx skill-family-doc-render@0.7.0 --read-proof --proof-root /absolute/proof-root --proof relative/conclusion.json
```

## 中文表达配置

`skill-family-docs-build-site` 通过 `humanize-rewrite` 共享入口与 `agent-method-registry` 解析中文写作方法，默认推荐在项目根目录 `agent-methods.yaml` 配置 `shuorenhua` 进行原稿自然中文直编（取消默认调用 Qwen3 分节改写与机械句长/连词统计）。若项目显式覆盖为其他合法实现则严格遵循，遇禁用或无效配置时报错停止，不静默回退。纯渲染与全部只读检查均不调用外部模型。

## 安装、可用性与宿主支持边界

`package.json`、插件清单与平台清单中的版本号记录当前源码版本。目标版本完成发布、通过验证，并由 Skill Family Hub 接受登记后，方可从 Hub 安装（宿主是否生效以实际安装记录为准）。例如在 Codex 终端登记市场源并安装插件：

```bash
codex plugin marketplace add ifoohoo/skill-family-hub
codex plugin add skill-family-docs@skill-family-hub
```

Claude Code 与 Kimi Code 可在会话中通过 `/plugin marketplace add` 与 `/plugin install skill-family-docs@skill-family-hub` 安装；WorkBuddy 在插件面板添加同一市场源安装；Antigravity 将公开仓库克隆至本地插件目录即可按根级 `plugin.json` 加载。

<a id="support-scope"></a>

| 宿主环境 | 加载路径与支持范围 |
| --- | --- |
| Claude Code | 通过 `.claude-plugin/plugin.json` 从 `skills/` 加载 5 个技能；支持 `humanize-rewrite` Registry 解析 |
| Codex | 通过 `.codex-plugin/plugin.json` 从 `adapters/codex/skills/` 加载 5 个技能；支持 `humanize-rewrite` Registry 解析 |
| Kimi Code | 通过 `.kimi-plugin/plugin.json` 从 `adapters/kimi/skills/` 加载 5 个技能；支持诊断、创作、渲染与只读检查 |
| WorkBuddy / CodeBuddy | 通过 `.codebuddy-plugin/plugin.json` 从 `skills/` 加载 5 个技能；安装或升级后需重启客户端刷新菜单 |
| Antigravity | 通过根级 `plugin.json`（10 键白名单）从 `skills/` 加载 5 个技能；支持诊断、创作、渲染与只读检查 |

## 故障诊断

- 插件安装后在技能列表中不可见时，先确认目标版本已正式发布并由 Skill Family Hub 接受登记，再核对宿主插件安装记录并在需要时重启客户端刷新菜单。
- `skill-family-docs-setup` 提示运行环境或渲染包缺失时，按 Node.js `>=22.22.2 <23` 约束与官方 npm 已发布精确版本补齐依赖，不要将本地未发布候选当作线上可用版本。
- `--check-project` 报告覆盖落后、渲染漂移、内部坏链、版面溢出或过时限制词时，按终端提示回到源 Markdown 或配置文件修正并重新渲染，切勿直接手改生成的 HTML。

## 目录结构

```text
packages/skill-family-docs/
  package.json
  plugin.json                      # Antigravity 根级插件清单（读取 ./skills/）
  .claude-plugin/plugin.json
  .codex-plugin/plugin.json
  .kimi-plugin/plugin.json
  .codebuddy-plugin/plugin.json
  skills/                          # 5 个技能与参考文档的唯一编辑源
    skill-family-docs-help/
    skill-family-docs-quickstart/
    skill-family-docs-setup/
    skill-family-docs-build-site/
    skill-family-docs-check-site/
  adapters/
    claude/                        # platform-manifest.json + 生成的 skills/
    codex/
    kimi/
    workbuddy/
  README.md
  CHANGELOG.md
  LICENSE
```

<!-- release-skill:capability:safe-first-command -->
> 安全起点：调用 `skill-family-docs-setup`。它先执行零写入只读诊断；存在可安全补齐的缺项时展示精确计划与文件影响，再询问是否执行。未获明确授权前不安装依赖、不改配置、不渲染、不刷新覆盖快照。

<!-- release-skill:capability:external-write-boundary -->
> 外部写入边界：插件不执行软件发布，也不自动安装或更新宿主环境。用户明确同意 `setup` 展示且复核未漂移的计划后，仅修改计划内的本地项目配置；静态站点产物统一由渲染包写入 `public-release.json` 声明的 `site.target`。

Apache-2.0，详见 [LICENSE](LICENSE)。
