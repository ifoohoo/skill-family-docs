# skill-family-docs

多平台技能插件（kimi + workbuddy/codebuddy）：公开文档站的规划、写作、设计与渲染方法论。Apache-2.0，通用方法论，不含任何私有路径或业务数据。

## 它是什么

skill-family 生态的公开插件，教 agent 完成公开文档站的四件事：**规划**站点信息架构、**写**中文技术内容、**设计**站点视觉、**跑**渲染与校验。插件本身不含渲染实现——渲染由 npm CLI 包 `skill-family-doc-render` 完成（配置驱动的 GitHub Pages 知识站渲染器，读项目的 `public-release.json`，把 `docs/public/site/` 渲染成带导航 / 翻页 / 页脚的完整站点，写盘前做内容级泄漏扫描）。本插件描述它的配置契约与工作流，不替代它。

## 四个技能

- **help**：入口导览。四个技能各管什么、何时用哪个、与 npm 包的关系、最小上手示例。
- **render-site**：`public-release.json` 配置（`site.dir/target/pages/tokens`）、`docs/public/site/` 源结构（`pages.json` + `id.html` + `<!--NAV-->` / `<!--PAGER-->` / `<!--FOOTER-->` 注入点 + `@{NAME}_TAG@` / `@{NAME}_VERSION@` 版本占位符）、导航分层设计原则、内容完整性清单、渲染与 `--check` 基线校验工作流。
- **style-guard**：中文技术文档写作风格守卫，三道门——事实门（无材料不开长篇、禁 TODO 注水）、可读性门（句长变异、连词密度、长句率、术语首现解释）、风格门（硬禁清单 + 警告层）。附纯 Node 检测器 `scripts/check-style.mjs`，只报不改，硬禁命中退出 1：

  ```bash
  node adapters/kimi/skills/style-guard/scripts/check-style.mjs 稿件.md
  ```

- **site-design**：公开文档站 UI 指南——版式、可读性与可访问性、`assets/style.css` 定制约束（allowlist：html/css/js/svg，配图用自绘 SVG）、渲染后视觉自检清单（深色 / 浅色、窄屏、打印、键盘）。

kimi 与 workbuddy 两个 adapters 下的技能内容相同，平台中立。

## 安装

### kimi

从插件市场安装，或在 TUI 中直接安装 GitHub 仓：

```
/plugin install ifoohoo/skill-family-docs
```

仓库地址：<https://github.com/ifoohoo/skill-family-docs>

### workbuddy / codebuddy

插件仓自带市场文件 `.claude-plugin/marketplace.json`：在 CodeBuddy 中添加市场
`ifoohoo/skill-family-docs` 后安装 `skill-family-docs`。插件后续也会收录进
skill-family-hub 聚合市场。

## 目录结构

```
packages/skill-family-docs/
  package.json                    # private，仅作版本源
  .kimi-plugin/plugin.json        # kimi 平台清单
  .codebuddy-plugin/plugin.json   # codebuddy/workbuddy 平台清单
  .claude-plugin/marketplace.json # 自带市场文件（bundled-family，codebuddy 消费）
  adapters/
    kimi/skills/                  # help / render-site / style-guard / site-design
    workbuddy/skills/             # 同上，内容一致
  README.md
  LICENSE                         # Apache-2.0
```

## 许可

Apache-2.0，见 [LICENSE](LICENSE)。

<!-- release-skill:capability:safe-first-command -->
> **从这里开始：** 对一篇草稿运行风格检测器——`node adapters/kimi/skills/style-guard/scripts/check-style.mjs 稿件.md`。
> 它只读稿件、只报告问题、不改任何文件；四个技能的 SKILL.md 本身也都是纯阅读材料。

<!-- release-skill:capability:external-write-boundary -->
> **外部写边界：** 本插件只含方法论文档与一个只读检测器，不执行任何网络、git 或凭据操作。
> 站点渲染写盘由 npm 包 `skill-family-doc-render` 完成，其写盘范围以被渲染项目自己的
> `public-release.json` 声明的站点目标目录为界（收容 + 原子写 + 写前泄漏扫描）。

## 最小示例

```text
/plugin install ifoohoo/skill-family-docs    # kimi TUI 安装
# 安装后先读 help 技能，按路由进入 render-site / style-guard / site-design
```

## 配套 CLI

站点渲染由 npm 包完成：`npm install skill-family-doc-render`。日常安全第一命令是只读校验 `npx skill-family-doc-render --check`。

## 故障排查

- 如果渲染失败，先看退出信息：配置不合法或泄漏扫描命中都会以非零退出并给出具体文件位置。
- `--check` 报漂移时，重跑渲染刷新基线并核对 diff；确认是源改动导致后再提交产物。
- 技能安装后不可见时，确认平台清单指向的 `adapters/<平台>/skills/` 路径存在。
