# 表达方法的安装与解析

Docs 通过独立的 `humanize-rewrite` Skill 使用中文表达能力。该入口调用 `agent-method-registry` 的公开 v1 目录与项目覆盖接口，默认解析到 `chinese-humanize-rewrite`。它不代表 Registry v2 的信任证明或运行锁。

setup 先检查宿主是否发现共享入口，再运行入口提供的只读解析命令，核对项目 `agent-methods.yaml` 的实际选择。方法缺失时默认引导安装 `chinese-humanize-rewrite` 及共享入口。完整安装与替代方法注册步骤由 `humanize-rewrite-setup` 维护，Docs 不复制其模型配置或安装脚本。

`humanize-rewrite` 是独立技能族提供的共享中文编辑入口，首次接入可从公开坐标 [ifoohoo/humanize-rewrite v0.1.0](https://github.com/ifoohoo/humanize-rewrite/tree/v0.1.0) 获取依赖，市场与插件名称均为 `humanize-rewrite`。

Codex 用户依次执行两条命令，先执行 `codex plugin marketplace add ifoohoo/humanize-rewrite`，再执行 `codex plugin add humanize-rewrite@humanize-rewrite`。Claude Code 用户通过标准插件市场添加与安装流程，使用同一公开项目与同名插件。

安装完成后，调用已安装的 `humanize-rewrite-setup` 检查运行依赖与所选实现的模型配置。开发维护者可继续使用本地可核验工作区或个人链接，首次用户无需寻找相邻私有工作区。

用户可以指定 `shuorenhua` 或其他已安装实现，按共享 setup 的 Registry 项目覆盖步骤注册为同一名称。保留合法已有选择，禁用或坏覆盖不得恢复默认。

Node 环境服从所用包的 `engines.node`。模型地址、模型和凭据的配置由解析出的实现决定。setup 只报告是否配置，不回显值，不自动编辑 shell 配置或认证文件。用户在独立终端设置变量后，需让启动宿主的进程继承它们，必要时重新加载配置并重启宿主。不能假定另一个终端的变量已经进入当前进程。

分别报告站点渲染状态、方法安装与解析状态、所选实现的模型配置状态。setup 不自动发起模型调用。表达能力缺失只阻断起草、刷新和改稿，不阻断纯渲染、机械检查或治理操作。方法解析成功不代表改写完成。

当前自动解析按 Registry 支持的 Codex、Claude Code 身份执行。Kimi、WorkBuddy 等宿主不能冒用这两个身份，未验证的解析或原生子智能体能力须报告缺口。四宿主文件投影一致不代表四宿主实际调用均已通过。
