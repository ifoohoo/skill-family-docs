# 共享表达方法的安装、解析与配置边界

`skill-family-docs` 通过独立技能族提供的 `humanize-rewrite` 共享入口和 `agent-method-registry` 解析项目选用的中文写作实现。在文档站场景中，**默认推荐并采用 `shuorenhua`（原稿自然中文直编）**，直接把背景、条件、操作步骤与结果写清楚，不再默认外发 Qwen3 分节改写或跑机械句长/连词统计。

## 配置 `shuorenhua` 项目覆盖（推荐）

首次接入 `humanize-rewrite` 可从公开仓库 [ifoohoo/humanize-rewrite v0.1.0](https://github.com/ifoohoo/humanize-rewrite/tree/v0.1.0) 安装插件并调用 `humanize-rewrite-setup` 核验依赖。

在目标项目根目录创建或更新 `agent-methods.yaml`，将 `humanize-rewrite` 指向项目内相对路径或相对软链接指向的 `shuorenhua` 目录：

```yaml
schemaVersion: 1
overrides:
  humanize-rewrite:
    provider:
      scope: project
      skill: .agents/skills/shuorenhua
```

系统严格尊重项目已有选择：当 `agent-methods.yaml` 指定合法实现时按指定方法执行；当方法被禁用或覆盖路径无效时直接报错停止，绝不静默回退其他实现。

## 环境隔离与职责边界

- **只读检查与凭据保护**：Node.js 版本遵循项目与包的 `engines.node` 约束；`setup` 仅在本地只读检查配置与入口路径是否存在，绝不自动发起模型请求，也不回显任何密钥变量。
- **纯渲染与只读门禁隔离**：运行纯渲染、`--check-project`、`--check-layout`、`--check-stale-limits`、`--status`、`--refresh-coverage` 或 `check:release-docs` 时均不调用任何表达模型。
- **真实宿主身份**：当前 `humanize-rewrite` 的自动解析脚本支持 Codex（`codex`）与 Claude Code（`claude-code`）两种宿主身份；Kimi Code、WorkBuddy 与 Antigravity 保持站点接入、创作核收、纯渲染与只读门禁能力，按真实宿主身份执行，不冒用其他宿主标识。
