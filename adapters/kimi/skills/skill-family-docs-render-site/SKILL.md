---
name: skill-family-docs-render-site
description: skill-family-docs 插件技能：公开文档站的信息架构方法论与 skill-family-doc-render 渲染工作流。覆盖 public-release.json 的 site.dir/target/pages/versionSources/coverage/tokens 字段、站点源结构、导航设计、内容完整性、渲染与覆盖校验。规划站点、配置渲染器、处理渲染报错或基线漂移时使用。项目已声明 site（以 public-release.json 为准）时，代码、公开 API、命令、配置、制品或文档任务交付前也必须使用，以默认判断知识站影响并完成增量收尾。
---

# 站点渲染与信息架构

先决定站点讲什么、分几页，再谈渲染。渲染器是 dumb pipe：它按配置把页面源拼成站点，不替人决定信息架构。

协作拓扑前提：站点源在被渲染的项目仓里，渲染配置 `public-release.json` 在渲染工作区根部，渲染命令在工作区根执行。两者可以是同一个仓（项目根放一份 `public-release.json`），也可以是「项目仓 + 独立渲染工作区」两仓。

## 两种调用表面

- 自然语言输入：说明站点目标或遇到的渲染问题；从项目文件读取 `public-release.json`、站点源和现有基线，只有范围、权限、安全边界或外部动作不明确时询问。
- 参数明确输入：直接给出 repo、`public-release.json`、操作模式和站点源路径；不再重复理解意图。

两种输入最终都进入本技能同一份信息架构、渲染脚本与基线验收流程。本技能是站点渲染的唯一端到端业务入口，不增加 wrapper、controller、Worker、Registry、runner 或状态机。

## 日常任务的默认收尾

已安装本技能的 Agent 在代码、制品、配置或文档任务交付前，默认判断产品变化是否影响知识站。先读 `public-release.json`：

- 目标项目没有 `site` 配置时，先调用 `skill-family-docs-setup` 做只读诊断。诊断说明缺少的工具和配置后，由本技能创建或补齐站点配置、页面源、渲染产物和覆盖快照。`setup` 不写文件。
- 目标项目已有 `site` 配置时，走增量更新。Agent 只修改受影响的页面；页面归属不明确时，再读完整 `pages.json`。

增量收尾按以下顺序执行：

1. 读取当前 Git 变化。分别查看 `git diff --cached`、`git diff` 和 `git status --short`，并读取与任务相关的未跟踪文件，避免只看 diff 而漏掉新文件。
2. 项目采用 artifact-graph 时，运行 `artifact-graph version-lock refresh --changed-only --worktree --format json`，取得变化路径和受影响关系。项目没有采用时跳过，并记录这项输入未配置。
3. 对受影响的 Feature、Scenario 或 Design 运行 `artifact-graph context` 或 `artifact-graph packet`，把需求、场景、设计、源码和测试放到同一份变化上下文里。
4. 在渲染工作区根运行 `skill-family-doc-render --status --repo <name>`，查看站点绑定版本、覆盖是否落后和变化文件。
5. Agent 结合 Git 变化、制品上下文和覆盖状态做语义判断：产品可见行为、公开接口、命令、配置、版本、限制或操作步骤变化时，修改对应页面。内部实现变化且对读者没有影响时，保留“不改正文”的判断。
6. 正文变化时，用 `skill-family-docs-style-guard` 依次核对事实、理解成本和表达，再冷读实际读者任务。脚本输出只是定位信号，退出 0 不能代表页面已经容易读懂。
7. 语义判断和风格检查完成后，运行 `skill-family-doc-render --refresh-coverage --repo <name>` 刷新覆盖快照。这个命令不能提前用来消除落后状态。
8. 页面源发生变化时，运行 `skill-family-doc-render --repo <name>` 重新渲染。不改正文时不制造无意义的产物改动。
9. 最后执行项目现有的 `check:release-docs`，确认制品链、覆盖快照、HTML 正文风格、渲染基线、链接和资源一起通过。

release-skill 的 `hooks.docs` 只调用这个确定性检查入口。它不调用 LLM（大语言模型）或技能，不修改正文、覆盖快照或渲染产物；检查失败时阻止发布计划冻结，再由 Agent 回到上面的流程处理。

## 一、信息架构：先规划，后写页

一个公开知识站的页面按读者任务分层，不按功能模块平铺：

- **首页（index）**：学习地图。回答"这个站点讲什么、从哪页开始读"，不放正文细节。`pages.json` 里给它 `"inPager": false`，让它不进翻页链——首页是入口，不是章节。
- **章节页**：一页讲透一个主题，页与页之间是阅读顺序（教程）或主题并列（参考）。order 字段决定顺序，也决定导航和翻页的前后关系。
- **页数控制**：单页超过读者一次能消化的量才拆页；拆出来的每页必须能独立成立（有标题、有结论、有归属），不为凑数拆。

导航分层原则：

- 导航条目就是 `pages.json` 的 `title`，控制在 10 个字以内，动词或主题词开头，不用"第一章 / 第二节"这种只有顺序没有语义的标题。
- 导航只有一层（渲染器生成平铺 `nav.toc`），所以页数要有纪律：经验值 5–12 页。超过就合并，或把细节下沉到页内锚点。
- 翻页链（pager）是阅读路径：教程类站点按"学完这页自然想学下页"排序；参考类站点可以不依赖翻页，靠导航直达。渲染器按取模回绕，翻页链是循环的：链内末页的"下一页"回到链内首页，首页的"上一页"回到末页。

## 二、public-release.json 配置

渲染器读工作区根部的 `public-release.json`，`repos` 数组里**谁带 `site` 字段就渲染谁**。一项的最小形态：

```json
{
  "name": "my-project",
  "source": "path/to/my-project",
  "tagPrefix": "my-project-v",
  "site": {
    "dir": "docs/public/site",
    "target": "docs",
    "pages": "pages.json",
    "versionSources": {
      "@MY_PROJECT_VERSION@": {
        "source": "package.json",
        "pointer": "/version"
      },
      "@MY_PROJECT_TAG@": {
        "source": "package.json",
        "pointer": "/version",
        "prefix": "my-project-v"
      }
    },
    "coverage": {
      "lock": "site-coverage-lock.json",
      "inputs": ["package.json", "src/**", "docs/public/site/**"]
    }
  }
}
```

字段语义：

- `name`：repo 标识，同时用于派生版本占位符名（大写、非字母数字转 `_`，如 `my-project` → `MY_PROJECT`）。
- `source`：项目相对渲染工作区根的路径。
- `tagPrefix`：版本标签前缀，拼上项目 `package.json` 的 `version` 得到完整 tag。
- `site.dir`：页面源目录，相对 `source`。这是配置项不是硬编码路径——`docs/public/site` 是给新项目的约定，渲染器仓自带 examples 用的是 `site-src`，两处差异只是配置取值不同。
- `site.target`：渲染产物目录（GitHub Pages 源），相对 `source`。渲染时会**清空重建**该目录，产物目录里不要放手写文件。
- `site.pages`：页面清单文件名，固定位于 `site.dir` 下。
- `site.versionSources`：把版本 token 映射到 `{ source, pointer, prefix?, suffix? }`。`source` 是相对 `repo.source` 的 JSON 文件，`pointer` 是指向标量版本值的 JSON Pointer（JSON 指针）；`prefix` 和 `suffix` 只负责格式化，不复制版本。每个版本源文件都会自动纳入覆盖输入。
- `site.coverage`：`lock` 声明覆盖快照的相对路径，`inputs` 列出相对 `repo.source` 的产品输入 glob。每个 glob 必须匹配至少一个文件；覆盖快照自身自动排除。
- `site.tokens`（可选）：额外静态占位符，键值对，页面源里写键名即被替换，例如 `"@CUSTOM_NOTE@": "任意值"`。

## 三、docs/public/site/ 源结构

```
docs/public/site/
  pages.json          # 站点元数据 + 页面清单
  index.html          # 每个 pages[].id 对应一个 id.html
  01-some-topic.html
  assets
    style.css         # 站点样式（allowlist：html/css/js/svg）
```

assets 只拷贝一层，不递归子目录；只有 `.html`、`.css`、`.js`、`.svg` 四种后缀进产物。

`pages.json` 形态：

```json
{
  "site": { "title": "站点标题", "lang": "zh-CN", "owner": "your-org", "repo": "my-project" },
  "pages": [
    { "id": "index", "title": "首页 · 学习地图", "order": 0, "inPager": false },
    { "id": "01-some-topic", "title": "某主题", "order": 1 }
  ]
}
```

页面源 `id.html` 是完整 HTML 文档（含 `<head>` 和样式链接），正文里放三个注入点，渲染时替换：

- `<!--NAV-->`：顶部导航，当前页自动加 `class="active"`。
- `<!--PAGER-->`：上一页 / 下一页翻页链。`inPager: false` 的页不在链里。
- `<!--FOOTER-->`：站点页脚（版权与许可信息）。

渲染器保留两个从 `name` 派生的兼容占位符：

- `@{NAME}_TAG@` → `${tagPrefix}${version}`，如 `@MY_PROJECT_TAG@`。
- `@{NAME}_VERSION@` → `${version}`（默认取自项目 `package.json`）。

公开页面的版本和标签优先显式配置 `site.versionSources`。同名 token 同时出现在 `site.tokens` 或兼容占位符时，JSON 版本源的值最终生效。页面源里直接写占位符，不在正文手写版本号。

注意版本兜底：项目根 `package.json` 缺失或读不出 `version` 时，占位符回退 `0.0.0`（渲染器会打 WARNING）并原样烤进公开站与基线。渲染前确认项目的 `package.json` 存在且 `version` 合法，别把 `0.0.0` 发布出去。

## 四、内容完整性清单

渲染前逐页核对：

- 每页有归属：`pages.json` 里每个 `id` 都有对应的 `id.html`，没有孤儿文件，也没有缺失页。
- 无占位残留：渲染产物里搜不到 `@` 包裹的未替换占位符；正文不留「待补充 / TODO」。
- 无死链：页内 `<a href>` 指向的页都在页面清单里；站外链接逐个确认可访问。
- 版本一致：版本号、tag 全部走占位符，每个值只读取 `site.versionSources` 声明的 JSON 事实源。
- 注入点齐全：每页都有 NAV / PAGER / FOOTER 三处注释，漏一个就少一块导航。
- 泄漏自检：页面源不含本机绝对路径（用户目录、盘符路径等形式）、内部域名、凭据。渲染器写盘前会跑内容级泄漏扫描（解码后再匹配，防 HTML 实体绕过），扫描覆盖渲染页面与 assets 文本文件（html/css/js/svg），命中即 fail-fast——但扫描是兜底，不是写作许可。

## 五、渲染与校验工作流

```bash
npm install --save-exact skill-family-doc-render@0.3.0
npx --no-install skill-family-doc-render
npx --no-install skill-family-doc-render --repo my-project
npx --no-install skill-family-doc-render --check
npx --no-install skill-family-doc-render --status --repo my-project
npx --no-install skill-family-doc-render --refresh-coverage --repo my-project
```

第一条命令安装精确版本。后续命令在渲染工作区根（`public-release.json` 所在目录）执行；`--no-install` 保证 npx 只使用当前项目已安装的版本，不临时获取其他版本。

工作流约定：

1. 改页面源 → 跑渲染 → 渲染器重建 `target` 目录并写 `site-baseline.json`（产物树 sha256 摘要）。
2. 把产物和基线一起提交。`--check` 用内存产物重算摘要与已提交基线比对，不一致即"漂移"退出 1——含义是"有人改了产物没改源，或改了源没重渲染"，回源目录修，不手改产物。
3. 泄漏扫描在写盘前执行，命中即停，整个 repo 不落盘。扫描字面量可通过 `public-release.json` 的 `forbiddenPublicPaths` / `privateLiterals` 追加，不为转绿删默认规则。
4. 产物目录每次渲染清空重建，所以任何"直接改 docs/ 产物"的修复都会被下次渲染冲掉——所有修改回 `site.dir` 源目录做。

`--status` 和 `--refresh-coverage` 都必须与 `--repo <name>` 一起使用。`--status` 只读重算输入摘要：快照一致退出 0，快照缺失或落后退出 1，未配置 `site.coverage`、路径或 JSON Pointer 非法、glob 无匹配或 Git 失败退出 2。`--refresh-coverage` 只在 Agent 完成语义判断和风格检查后原子写入快照，不渲染站点，也不修改 Git。

覆盖快照只保存 `inputs` 中的相对路径与文件摘要、聚合摘要 `sha256`，以及项目采用 artifact-graph 时的可选 `artifactGraphVersionLockSha256`。它不保存版本、发布状态、关系、审阅人或批准结论。

渲染器参数细节以 npm 包 `skill-family-doc-render` 的 README 为准；本技能不复述其实现，只描述契约。
