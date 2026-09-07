---
name: skill-family-docs-quickstart
description: skill-family-docs 插件的意图路由入口。按用户意图确定性路由到 help、setup、render-site、style-guard 或 site-design。只做路由，不执行业务流程。
---

# 公开知识站意图路由

`skill-family-docs-quickstart` 只返回目标技能和必要的后续顺序。它不读取配置，不执行命令，也不写入文件。

| 用户意图 | 目标技能 |
| --- | --- |
| 查看能力总览或不确定该用哪个 | `skill-family-docs-help` |
| 只检查环境、配置和项目是否就绪 | `skill-family-docs-setup` 的只读诊断 |
| 明确要求接入项目、准备环境并接线 | `skill-family-docs-setup` 的本地接入 |
| 首次生成、刷新知识、只重新渲染、调整目录或升级模板 | `skill-family-docs-render-site` |
| 起草或审校中文正文 | `skill-family-docs-style-guard` |
| 验收或明确调整站点阅读体验 | `skill-family-docs-site-design` |

意图能唯一落到一行时，只返回该技能。请求横跨多个阶段时，返回第一个技能，并列出后续顺序。意图仍不明确时，路由到 `skill-family-docs-help`。

路由结果不扩大用户授权。“检查”不能路由成写入接入，“只重新渲染”不能路由成内容刷新。
