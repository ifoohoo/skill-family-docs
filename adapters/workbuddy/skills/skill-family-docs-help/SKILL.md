---
name: skill-family-docs-help
description: skill-family-docs 插件的能力导览。说明六个技能各管什么、何时使用、与 skill-family-doc-render 的关系及最短使用路径。在公开知识站领域不确定该用哪个技能时使用。
---

# skill-family-docs 能力导览

本插件让 Agent 用受限 Markdown 维护公开知识站。起草或刷新由 style-guard 组织脚本拟稿：宿主明确事实、读者和任务，审核大纲，按完整语义单元顺序拟稿并传入已接受前文，最后核收全文。安装者可选择 OpenAI 兼容服务、模型和 key 的环境变量来源。缺配置、失败或候选未接受时保留原稿，报告表达优化未完成。纯渲染、只读检查和发布钩子不调用模型。

精确版本的 `skill-family-doc-render` 负责 `editorial` 模板、导航、样式、交互、扫描和确定性输出，新站不需要手写 HTML、CSS 或 JavaScript。0.6.0 已分发可配置表达脚本；主流程替换已随 0.6.1 正式发布并分发。模型输出与检测器退出 0 都不能代替语义和可读性验收。

## 六个技能

- `skill-family-docs-help`：提供入口导览和最短路径。
- `skill-family-docs-setup`：先只读诊断。缺项可安全处理时给出精确计划、影响和授权问题；只有用户明确同意已展示且复核未漂移的计划后，才执行授权范围内的本地配置。
- `skill-family-docs-quickstart`：根据意图选择其他五个技能，并在同一轮把请求交给目标技能继续执行；它不重复目标技能的业务逻辑。
- `skill-family-docs-render-site`：处理首次生成、内容刷新、纯渲染，以及用户明确要求的目录调整或模板升级。
- `skill-family-docs-style-guard`：组织大纲与脚本拟稿，核收事实、理解和表达；只读审校不改稿。
- `skill-family-docs-site-design`：验收固定 `editorial` 主题的阅读与交互体验。

在选择安装/升级组合或了解验证限制时，请查阅 [README支持范围](https://github.com/ifoohoo/skill-family-docs#support-scope)。

## 最短使用路径

1. 检查环境时，调用 `skill-family-docs-setup`。环境已就绪时直接返回；存在缺项时，setup 先展示精确计划和影响，再询问是否执行。
2. 首次接入时可以直接说明“接入项目并接线”。setup 先展示精确计划和影响，用户明确同意该计划后才补缺项；正文交给 render-site。
3. 请求“首次生成知识站”或“根据当前变化刷新知识”时，调用 `skill-family-docs-render-site`。
4. 只需按现有源重建时，明确说明“只重新渲染”。该模式不审阅正文，也不刷新覆盖快照。

## 与渲染包的边界

`public-release.json` 决定渲染哪个项目。新站使用 `site.format: "markdown-v1"` 和 `site.template: "editorial"`；`pages.json` 是页面 ID、分组、顺序、职责和阅读路径的唯一清单，正文保存在 `<id>.md`。

渲染包的 `--check-project --repo <name>` 执行只读机械项目检查。项目还没有网站配置时，扫描停在现有失败原因，不会初始化或创建站点。

下方两条用于共同证明与读取旧证明的命令使用 `skill-family-doc-render@0.6.0` 精确版本，属于保留的历史用法示例，不代表当前推荐版本或组合。实际选择插件、渲染器与宿主的组合时，请查阅前文的 [README 支持范围](https://github.com/ifoohoo/skill-family-docs#support-scope)。调用前需在官方 npm 确认所选精确版本可用。已发布的 0.4.5 版本不支持 `--conclusion-output` 与 `--read-proof` 参数。正式发布、Hub 登记及宿主实际加载的验证均需依据真实记录，不得从示例命令推导。

扫描时在目标 `public-release.json` 所在目录运行：

```bash
npx skill-family-doc-render@0.6.0 --check-project --repo <name> --conclusion-output <绝对路径>
```

读取旧证明可以在任意工作目录运行：

```bash
npx skill-family-doc-render@0.6.0 --read-proof --proof-root <root> --proof <相对路径>
```

`--read-proof` 只用调用方给出的 proof-root 和该根内相对路径。它不读 `public-release.json`，不要求站点配置，也不重新扫描目标。旧证明只记录原目标当时的结论。

扫描、读证和刷新都不会隐式整改、建站或执行目标 hook。渲染器证明只覆盖机械范围，链接检查通过不能代替正文审阅。记载未通过、未完成或未能开展检查的证明，结论保持为未通过。本地候选上已有的出证和读证验证，仍只覆盖当时的机械范围。

未声明 `site.format` 的旧项目仍走 HTML 兼容路径。已有自定义渲染器时，setup 区分保留现状、兼容接入、有冲突和显式迁移，不以“不适用”结束，也不修复原渲染器。只有用户明确选择迁移或调整结构时，技能才修改清单、格式或模板。

本插件不发布软件，不更新宿主安装，也不把本地版本当成已发布证据。

## 回复时说明入口

完成导览后，用几句话说明本次适用入口、选择依据、最短下一步和必要限制。内容来自用户请求与上文边界，没有对应事实时省略该项，不要套用固定栏目标题。
