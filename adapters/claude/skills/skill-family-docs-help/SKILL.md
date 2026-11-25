---
name: skill-family-docs-help
description: skill-family-docs 技能族的能力导览。说明五个技能各自的职责边界、与 skill-family-doc-render CLI 的配合方式及最短上手路径，在不确定应选用哪个公开文档站技能时触发。
---

# skill-family-docs 能力导览

`skill-family-docs` 帮助开发者为 AI 技能族与命令行工具零前端负担地规划、编写、渲染并校验现代静态文档站。它与独立 npm 工具 `skill-family-doc-render@0.7.0` 配合工作：技能负责接入配置、组织面向外部使用者的内容与可读性核收；CLI 负责确定性 Markdown 编译、`modern` 三栏模板渲染、内容指纹防缓存（`?v=<sha8>`）、解码后防泄漏扫描与只读质量门禁。

## 五个技能分工

| 技能 | 什么时候用 | 核心动作与边界 |
| --- | --- | --- |
| `skill-family-docs-help` | 想了解全部能力，或不确定该从哪个技能开始 | 梳理 5 个技能的边界、推荐入口和可执行示例，不做磁盘写入 |
| `skill-family-docs-quickstart` | 只描述目标任务、还没点名具体技能 | 识别真实意图并在同一轮直接加载对应技能继续执行 |
| `skill-family-docs-setup` | 首次接入文档站，或检查环境与配置是否就绪 | 先零写入诊断并展示精确计划，获批且复核未漂移后再写入本地配置 |
| `skill-family-docs-build-site` | 首次建站、随代码变化增量更新、整篇改写或纯渲染 | 面向外部读者组织弹性章节与 6 大组件，采用 `shuorenhua` 自然中文直编并冷读核收后渲染 |
| `skill-family-docs-check-site` | 发版前或改完文档后做全面只读验收 | 校验代码事实一致性、死链、多视口零横向溢出、防私密泄漏、过时限制与覆盖基线 |

## 最短使用路径

1. **首次接入项目**：调用 `skill-family-docs-setup`。先做零写入环境探测与配置规划，待维护者确认后再落盘 `public-release.json`、`pages.json` 与门禁接线。
2. **编写新站或随功能迭代更新**：调用 `skill-family-docs-build-site`。按外部用户真实任务撰写或增量刷新 Markdown 页面，经自然中文直编与外部读者冷读后渲染生成静态站并更新 `site-coverage-lock.json`。
3. **只重新渲染或做只读门禁巡检**：只需重建 HTML 时明确告知 `build-site`“只重新渲染”；只做发布前检查时调用 `skill-family-docs-check-site`。

## 与渲染器 CLI 的协作边界

- 配置文件真源是工作区根目录的 `public-release.json`，新站声明 `site.format: "markdown-v2"` 与 `site.template: "modern"`（存量 `markdown-v1` 与 `editorial` 自动兼容映射至现代渲染内核）。新建独立公开静态文档仓统一命名为 `<owner>/<id>-site`（`main:/` 部署，打 `site-v{version}` 标签），在 `site` 中声明 `publicSiteRepo` 与 `pagesUrl`，并在关联公开仓库 `About -> Website (homepageUrl)`、`package.json#homepage` 与公开 `README.md` 首屏三处同步放置显式 GitHub Pages 入口，关停旧的插件仓内重复 Pages。
- `pages.json` 声明站点标题、标语、分组与页面顺序，正文存放在 `site.dir/<id>.md`。
- 常用只读检查命令（在 `public-release.json` 所在目录运行）：

```bash
npx skill-family-doc-render@0.7.0 --check-project --repo <name>
npx skill-family-doc-render@0.7.0 --check-layout --repo <name>
npx skill-family-doc-render@0.7.0 --check-stale-limits --repo <name>
npx skill-family-doc-render@0.7.0 --status --repo <name>
```

- 五宿主（Claude Code、Codex、Kimi Code、WorkBuddy / CodeBuddy、Antigravity）共享同一组 5 个技能；本插件不执行远端 Git 推送或软件发布。

## 回复说明要点

向使用者导览时，直接结合当前请求给出推荐技能、选择原因与一条可立即复制的启动提示词，省略不适用的空项目。

<!-- @feature DOC1 @scenario S-01 -->
