---
name: skill-family-docs-help
description: skill-family-docs 插件的能力导览。说明六个技能各管什么、何时使用、与 skill-family-doc-render 的关系及最短使用路径。在公开知识站领域不确定该用哪个技能时使用。
---

# skill-family-docs 能力导览

本插件让 Agent 用受限 Markdown 维护公开知识站。LLM（大语言模型）只负责有依据的正文；精确版本的 `skill-family-doc-render` 负责 `editorial` 模板、导航、样式、交互、扫描和确定性输出。新站不需要手写 HTML、CSS 或 JavaScript。

## 六个技能

- `skill-family-docs-help`：提供入口导览和最短路径。
- `skill-family-docs-setup`：先只读诊断。缺项可安全处理时给出精确计划、影响和授权问题；只有用户明确同意已展示且复核未漂移的计划后，才执行授权范围内的本地配置。
- `skill-family-docs-quickstart`：根据意图选择其他五个技能，并在同一轮把请求交给目标技能继续执行；它不重复目标技能的业务逻辑。
- `skill-family-docs-render-site`：处理首次生成、内容刷新、纯渲染，以及用户明确要求的目录调整或模板升级。
- `skill-family-docs-style-guard`：用事实、理解和表达三道检查审校中文技术内容。
- `skill-family-docs-site-design`：验收固定 `editorial` 主题的阅读与交互体验。

## 最短使用路径

1. 检查环境时，调用 `skill-family-docs-setup`。环境已就绪时直接返回；存在缺项时，setup 先展示精确计划和影响，再询问是否执行。
2. 首次接入时可以直接说明“接入项目并接线”。setup 先展示精确计划和影响，用户明确同意该计划后才补缺项；正文交给 render-site。
3. 请求“首次生成知识站”或“根据当前变化刷新知识”时，调用 `skill-family-docs-render-site`。
4. 只需按现有源重建时，明确说明“只重新渲染”。该模式不审阅正文，也不刷新覆盖快照。

## 与渲染包的边界

`public-release.json` 决定渲染哪个项目。新站使用 `site.format: "markdown-v1"` 和 `site.template: "editorial"`；`pages.json` 是页面 ID、分组、顺序、职责和阅读路径的唯一清单，正文保存在 `<id>.md`。渲染包的 `--check-project --repo <name>` 执行只读项目检查。

未声明 `site.format` 的旧项目仍走 HTML 兼容路径。已有自定义渲染器时，setup 区分保留现状、兼容接入、有冲突和显式迁移，不以“不适用”结束，也不修复原渲染器。只有用户明确选择迁移或调整结构时，技能才修改清单、格式或模板。

本插件不发布软件，不更新宿主安装，也不把本地版本当成已发布证据。
