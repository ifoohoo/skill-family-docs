---
name: skill-family-docs-help
description: skill-family-docs 插件的入口导览，仅覆盖公开文档站规划、写作、设计与渲染这一领域。说明六个技能（skill-family-docs-help、skill-family-docs-render-site、skill-family-docs-style-guard、skill-family-docs-site-design、skill-family-docs-setup、skill-family-docs-quickstart）各管什么、何时用哪个、与 npm 包 skill-family-doc-render 的关系，并给出最小上手示例。在 skill-family-docs / 公开文档站渲染领域内不确定该用哪个技能时使用。
---

# skill-family-docs 能力导览

本插件教 agent 完成公开文档站的四件事：规划、写作、设计、渲染。它本身不含渲染实现——渲染由 npm CLI 包 `skill-family-doc-render` 完成，插件负责方法论。

## 六个技能各管什么

- **skill-family-docs-help**（本技能）：入口导览。不确定用哪个技能时先读这里。
- **skill-family-docs-render-site**：站点信息架构 + 渲染工作流。回答"站点分几页、每页放什么、怎么跑渲染、怎么校验基线"。涉及 `public-release.json` 配置、`docs/public/site/` 源结构、注入点、版本占位符、泄漏扫描和 `--check` 校验。
- **skill-family-docs-style-guard**：中文技术文档写作风格守卫。三道门：事实门（没材料不开长篇）、可读性门（句长变异、连词密度、术语首现解释）、风格门（硬禁清单 + 警告层）。附带纯 Node 检测器 check-style.mjs（在该技能的 scripts 目录下），只报不改。
- **skill-family-docs-site-design**：公开文档站 UI 设计指南。版式、可读性、可访问性、站点样式文件 style.css 的定制约束、渲染后视觉自检清单。
- **skill-family-docs-setup**：只读环境就绪检查。检查 Node、CLI、`public-release.json` 与站点源是否就绪；只检查不安装、不写盘。
- **skill-family-docs-quickstart**：只做意图路由。听用户意图指到目标技能后退出，不承载执行生命周期。

## 何时用哪个

- 从零规划一个公开文档站 → 先 `skill-family-docs-render-site` 定信息架构，再 `skill-family-docs-site-design` 定视觉。
- 写或改站点页面正文（.html 里的中文内容）→ `skill-family-docs-style-guard`。
- 页面写完，要跑渲染、处理渲染报错或基线漂移 → `skill-family-docs-render-site`。
- 渲染完成，要检查"看起来对不对" → `skill-family-docs-site-design` 的视觉自检清单。
- 首次接入，或环境异常（Node / CLI / 配置 / 站点源不齐）→ 先 `skill-family-docs-setup` 做只读环境就绪检查。
- 渲染前想确认环境就绪 → `skill-family-docs-setup`。
- 意图不清、不确定该用哪个技能 → `skill-family-docs-quickstart` 做意图路由。

## 与 npm 包 skill-family-doc-render 的关系

`skill-family-doc-render` 是配置驱动的 GitHub Pages 知识站渲染器：读项目里的 `public-release.json`，把各项目 `docs/public/site/` 下的页面源渲染成带导航、翻页、页脚的完整站点，写盘前做内容级泄漏扫描。本插件的 `skill-family-docs-render-site` 技能描述它的配置字段和工作流；实际执行渲染时以该包自带的 README 和脚本输出为准，插件不替代它、也不复述它的实现细节。

## 最小上手示例

一个项目要建公开文档站，最短路径：

1. 在项目根建 `docs/public/site/`，放 `pages.json`（站点元数据 + 页面清单）和每页一个 `id.html`（含 `<!--NAV-->`、`<!--PAGER-->`、`<!--FOOTER-->` 注入点）。
2. 在渲染器工作区的 `public-release.json` 里给该项目加 `site` 字段（`dir`/`target`/`pages`）。
3. 用 `skill-family-docs-style-guard` 过一遍页面正文，跑 `check-style.mjs` 清掉硬禁。
4. 运行渲染：`npx skill-family-doc-render@0.2.0`；校验基线：`npx skill-family-doc-render@0.2.0 --check`。两条命令在渲染工作区根（`public-release.json` 所在目录）执行——渲染工作区从哪来：clone 渲染器仓（skill-family-doc-render-workspace），或在自己项目根放一份 `public-release.json` 后直接用 npx 跑。
5. 用 `skill-family-docs-site-design` 的自检清单在浏览器里过一遍成品。

各步骤的细节见对应技能，不在本文件展开。
