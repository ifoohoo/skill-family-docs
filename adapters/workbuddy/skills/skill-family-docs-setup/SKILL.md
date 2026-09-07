---
name: skill-family-docs-setup
description: skill-family-docs 插件技能：只读检查公开文档站渲染环境是否就绪。检查安装闭包（skill-family-doc-render npm 包）、Node 与 CLI 可用性、public-release.json、版本源与 release unit 的一致性、站点源目录和渲染前置条件；环境就绪时明确报告无需变更。只读检查：不自动安装依赖、不创建或修改配置、不执行渲染写盘、不调用发布动作。仅在公开文档站领域使用：首次接入、环境异常诊断或渲染前就绪确认时。
---

# 环境就绪检查（只读）

`skill-family-docs-setup` 只做一件事：检查公开文档站渲染环境是否就绪。检查项全部只读；环境已就绪时明确报告「无需变更」，不做多余动作。

## 检查清单

按顺序逐项执行，任一失败即停并报告缺什么、怎么补（怎么补是人的决定，本技能不代劳）：

1. **Node 版本**：`node --version`。渲染器要求 Node ≥ 22.22.2 且 < 23（npm 包 `skill-family-doc-render` 的 `engines` 声明）。版本不符时报告实际版本与要求，不自动切换 Node。
2. **CLI 可用性**：按顺序找一个已存在的 `skill-family-doc-render` 命令，只执行找到的那一个：
   1. 当前项目的 `node_modules/.bin/skill-family-doc-render`；
   2. `command -v skill-family-doc-render` 找到的本机命令。
   用该命令执行 `--help`，应输出用法并退出 0；`--help` 是只读命令。两条路都找不到时，只报告 CLI 缺失，并建议维护者安装精确版本 `skill-family-doc-render@0.3.0`；本技能不执行安装，也不访问 registry。第 6 步复用本步发现的同一命令。
3. **工作区配置**：渲染工作区根存在 `public-release.json` 且是可解析 JSON。只读取校验，不创建、不修改。
4. **版本源一致性**：只读取 `.release-skill/project.yaml`。对 `site.versionSources` 中表示 release unit 版本或标签的每个 token，将 `repo.source + versionSources.<token>.source` 规范化为工作区相对路径；再将对应 `releaseUnits[].source + releaseUnits[].version.source` 用同样方式规范化。两条组合路径必须指向同一个 JSON 事实源，冲突时立即停止并列出 token、release unit 和两条路径。不修改任何一份配置来自动消除冲突。
5. **站点源完整性**：对 `public-release.json` 里每个带 `site` 字段的 repo 确认：
   - `site.dir` 下的 `pages.json` 存在且可解析；
   - `pages.json` 里每个 `id` 都有对应的 `id.html`；
   - 被检查项目的站点源中若有名为 assets 的子目录，其中文件只能使用 allowlist 后缀（`.html` / `.css` / `.js` / `.svg`，二进制一律进不了产物）。
6. **基线与覆盖状态**：用第 2 步发现的同一命令执行 `--check`（只读校验，不写盘）。报漂移说明源与产物不一致、需要重渲染。对每个带 `site.coverage` 的 repo，再用同一命令执行 `--status --repo <name>`：退出 0 表示覆盖一致，退出 1 表示快照缺失或落后，退出 2 表示配置或工具错误。重渲染和刷新覆盖都属 `skill-family-docs-render-site`，不在本技能范围。

## 结果报告

- 全部通过：明确报告「环境就绪，无需变更」，逐项给一条通过证据。
- 有缺失：逐项列出缺失项、观察到的现象和补救方向（例如「Node 版本不符：装 22.x」「基线漂移：回源目录改后重渲染」）。本技能不执行补救。

## 边界

- 只运行已存在的 CLI（按检查清单第 2 步的顺序发现）；CLI 缺失时只报告缺失与安装方向，不执行安装、不访问 registry。
- 不创建、不修改 `public-release.json`、站点源或任何配置文件。
- 不执行渲染写盘（渲染属 `skill-family-docs-render-site`）。
- 不调用任何发布动作。
- 检查命令的输出只用于诊断，不写进任何文件。
