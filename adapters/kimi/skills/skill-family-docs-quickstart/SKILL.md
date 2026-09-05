---
name: skill-family-docs-quickstart
description: skill-family-docs 插件意图路由入口：按用户意图确定性路由到 skill-family-docs-help / skill-family-docs-setup / skill-family-docs-render-site / skill-family-docs-style-guard / skill-family-docs-site-design 之一。只做路由，不承载执行生命周期。仅在公开文档站领域用户意图需要分诊时使用。
---

# 意图路由（只路由，不执行）

`skill-family-docs-quickstart` 只做意图路由：听用户的意图，指到目标技能，然后退出。本技能不承载执行生命周期：不定义 Task/Result、不维护状态、不排队步骤、不自己跑任何检查或渲染。

## 路由表

| 用户意图 | 目标技能 |
|---|---|
| 不确定用哪个技能，想看能力总览或最小上手示例 | `skill-family-docs-help` |
| 首次接入：检查安装闭包、Node、CLI、配置与站点源是否就绪 | `skill-family-docs-setup` |
| 规划站点信息架构、配置 `public-release.json`、跑渲染或处理基线漂移 | `skill-family-docs-render-site` |
| 写或改站点正文，要过事实 / 可读性 / 风格三道门 | `skill-family-docs-style-guard` |
| 设计或验收站点视觉（版式、可访问性、样式约束、自检清单） | `skill-family-docs-site-design` |

## 路由规则

1. 意图能唯一落到某一行 → 只返回该技能名，不展开执行。
2. 意图跨多行 → 只返回最先需要的那个，并说明后续技能的顺序；不执行任何一个目标。
3. 意图不在表内或说不清 → 路由到 `skill-family-docs-help`，说明那里有总览。

## 边界

- 只输出路由结论，不读取配置、不执行命令、不写文件。
- 不引入 Foundation Quickstart Profile、Task/Result、方法 Registry、runner 或 Harness。
- 执行生命周期属于被路由到的各技能自身，本技能不读取配置、不运行工具，也不维护任务、结果、进度、重试或发布状态。
