---
name: skill-family-docs-quickstart
description: skill-family-docs 插件的执行入口。按用户意图选择 help、setup、render-site、style-guard 或 site-design，并在同一轮调用目标技能继续执行；不重复目标技能的业务逻辑。
---

# 公开知识站执行入口

`skill-family-docs-quickstart` 先选择目标技能，再使用当前宿主的技能调用能力加载该技能，并在同一轮继续执行。它不在自身正文里重复目标技能的业务流程，也不能只返回技能名后停止。

| 用户意图 | 目标技能 |
| --- | --- |
| 查看能力总览或不确定该用哪个 | `skill-family-docs-help` |
| 检查环境、配置和项目是否就绪 | `skill-family-docs-setup`；缺项时展示计划和影响，再询问是否执行 |
| 明确要求接入项目、准备环境并接线 | `skill-family-docs-setup`；先展示计划和影响，再取得执行授权 |
| 首次生成、刷新知识、只重新渲染、调整目录或升级模板 | `skill-family-docs-render-site` |
| 起草或审校中文正文 | `skill-family-docs-style-guard` |
| 验收或明确调整站点阅读体验 | `skill-family-docs-site-design` |

意图能唯一落到一行时，调用该技能并返回它的实际结果。请求横跨多个阶段时，先调用第一个技能；只有用户请求确实覆盖后续阶段，且前一阶段已经满足进入条件，才继续调用后续技能。意图仍不明确时，调用 `skill-family-docs-help` 并返回能力导览。

目标技能拥有本次业务判断、工具选择、写入边界和完成标准。quickstart 不自行补写步骤，也不把目标技能的失败改写成成功。路由结果不扩大用户授权：“检查”只允许 setup 完成只读诊断、计划和授权询问，用户同意前不能写入；“只重新渲染”不能变成内容刷新。
