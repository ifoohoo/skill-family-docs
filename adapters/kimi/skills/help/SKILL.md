---
name: help
description: skill-family-docs 插件的入口导览。说明四个技能（help、render-site、style-guard、site-design）各管什么、何时用哪个、与 npm 包 skill-family-doc-render 的关系，并给出最小上手示例。用户刚装插件、不知道用哪个技能、或问"这个插件能做什么"时使用。
---

# skill-family-docs 能力导览

本插件教 agent 完成公开文档站的四件事：规划、写作、设计、渲染。它本身不含渲染实现——渲染由 npm CLI 包 `skill-family-doc-render` 完成，插件负责方法论。

## 四个技能各管什么

- **help**（本技能）：入口导览。不知道用哪个技能时先读这里。
- **render-site**：站点信息架构 + 渲染工作流。回答"站点分几页、每页放什么、怎么跑渲染、怎么校验基线"。涉及 `public-release.json` 配置、`docs/public/site/` 源结构、注入点、版本占位符、泄漏扫描和 `--check` 校验。
- **style-guard**：中文技术文档写作风格守卫。三道门：事实门（没材料不开长篇）、可读性门（句长变异、连词密度、术语首现解释）、风格门（硬禁清单 + 警告层）。附带纯 Node 检测器 check-style.mjs（在该技能的 scripts 目录下），只报不改。
- **site-design**：公开文档站 UI 设计指南。版式、可读性、可访问性、站点样式文件 style.css 的定制约束、渲染后视觉自检清单。

## 何时用哪个

- 从零规划一个公开文档站 → 先 `render-site` 定信息架构，再 `site-design` 定视觉。
- 写或改站点页面正文（.html 里的中文内容）→ `style-guard`。
- 页面写完，要跑渲染、处理渲染报错或基线漂移 → `render-site`。
- 渲染完成，要检查"看起来对不对" → `site-design` 的视觉自检清单。

## 与 npm 包 skill-family-doc-render 的关系

`skill-family-doc-render` 是配置驱动的 GitHub Pages 知识站渲染器：读项目里的 `public-release.json`，把各项目 `docs/public/site/` 下的页面源渲染成带导航、翻页、页脚的完整站点，写盘前做内容级泄漏扫描。本插件的 `render-site` 技能描述它的配置字段和工作流；实际执行渲染时以该包自带的 README 和脚本输出为准，插件不替代它、也不复述它的实现细节。

## 最小上手示例

一个项目要建公开文档站，最短路径：

1. 在项目根建 `docs/public/site/`，放 `pages.json`（站点元数据 + 页面清单）和每页一个 `id.html`（含 `<!--NAV-->`、`<!--PAGER-->`、`<!--FOOTER-->` 注入点）。
2. 在渲染器工作区的 `public-release.json` 里给该项目加 `site` 字段（`dir`/`target`/`pages`）。
3. 用 `style-guard` 过一遍页面正文，跑 `check-style.mjs` 清掉硬禁。
4. 运行渲染：`npm run render:site`；校验基线：`npm run render:site:check`。
5. 用 `site-design` 的自检清单在浏览器里过一遍成品。

各步骤的细节见对应技能，不在本文件展开。
