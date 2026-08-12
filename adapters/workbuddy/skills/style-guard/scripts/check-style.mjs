#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// check-style.mjs — 中文技术文档风格检测器（style-guard 三道门之风格门 + 可读性门）。
// 纯 Node 标准库，只报不改。硬禁命中 exit 1，输入错误 exit 2，其余 exit 0。
// 检测项定义见 ../references/*.md 与 ../SKILL.md；统计指标只是代理信号，不是可读性结论。
import { readFileSync, existsSync, statSync } from 'node:fs';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('用法: node check-style.mjs <稿件.md> [更多文件...]');
  process.exit(2);
}
for (const f of files) {
  if (!existsSync(f) || !statSync(f).isFile()) {
    console.error(`输入错误: 文件不存在或不是普通文件: ${f}`);
    process.exit(2);
  }
}

// --- 规则表（与 SKILL.md 风格门对齐） ---
// 每项: { id, level: 'failure'|'warning', re, msg, skipCode?: true }
const HARD_JARGON = [
  '赋能', '抓手', '闭环', '拉通', '底层逻辑', '顶层设计', '认知跃迁', '价值释放',
  '降本增效', '内容矩阵', '全链路', '组合拳', '想象空间', '技术底座', '认知增量',
  '生态化反', '颗粒度', '对齐颗粒度', '心智', '护城河',
];
const EMOTION_WORDS = ['强大', '优秀', '完美', '极致', '业界领先', '一流', '顶尖', '遥遥领先'];
const LYRIC_WORDS = ['安放', '抵达', '微光', '褶皱', '丰盈', '滚烫', '轻盈', '赤裸', '剥开', '温柔'];
const CONNECTIVES = ['因为', '所以', '但是', '然而', '同时', '此外', '因此', '不过', '而且', '并且'];

const RULES = [
  { id: 'bracket-label', level: 'failure',
    re: /【(强制|推荐|参考|说明|注意|禁止|必须|警告|提示|重要)】/g,
    msg: '方括号规则标签，改动词直陈' },
  { id: 'second-person', level: 'failure',
    re: /(^|[\s，。；：、"「『(（])你(们)?(需要|应该|必须|可以|要|得)|您(需要|应该|必须|可以)/g,
    msg: '第二人称说教，改用「开发者 / 用户 / 我们」或命令式', skipCode: true },
  { id: 'first-person', level: 'failure',
    re: /我(认为|觉得|建议|相信|发现|个人)/g,
    msg: '作者现身（我认为/我觉得…），让事实自己说话', skipCode: true },
  { id: 'exclamation', level: 'failure',
    re: /[!！]/g,
    msg: '感叹号，正文用句号', skipCode: true },
  { id: 'as-shown-below', level: 'failure',
    re: /如下(图|表|文|代码)?所示/g,
    msg: '「如下所示」，改「示例如下」或直指上文' },
  { id: 'empty-conclusion', level: 'failure',
    re: /(^|\n)\s*(总之|综上所述|综上|换言之|总而言之)[，,]/g,
    msg: '凭空收束语（总之/综上所述…），前文讲清了就不必再证明' },
  { id: 'placeholder', level: 'failure',
    re: /(待补充|待完善|文档后补|\bTODO\b|\bTBD\b|\bFIXME\b)/g,
    msg: '占位注水（待补充/TODO…），不进交付稿' },
  { id: 'jargon', level: 'failure',
    re: new RegExp(HARD_JARGON.join('|'), 'g'),
    msg: '商业黑话硬名单命中', skipCode: true },
  { id: 'emotion', level: 'failure',
    re: new RegExp(EMOTION_WORDS.join('|'), 'g'),
    msg: '情绪评价词，换中性事实', skipCode: true },
  // --- 警告层 ---
  { id: 'not-but', level: 'warning',
    re: /不是[^。！？\n]{1,30}[，,]?\s*而是/g,
    msg: '翻案腔嫌疑（不是A而是B），技术澄清可保留，抬价假误解要删', skipCode: true },
  { id: 'nominalization', level: 'warning',
    re: /(进行了|实现了|完成了对|开展了|起到了[^。！？\n]{0,12}作用|具有[^。！？\n]{0,12}意义)/g,
    msg: '名词化，还原成直接动词' },
  { id: 'lyric', level: 'warning',
    re: new RegExp(LYRIC_WORDS.join('|'), 'g'),
    msg: 'AI 抒情腔嫌疑，写具体事物可保留，给抽象概念穿衣服要删', skipCode: true },
  { id: 'prompt-colon', level: 'warning',
    re: /(下面是|如下|核心是|关键是|重点是)：/g,
    msg: '提示性冒号，节制使用' },
];

// --- 预处理：去掉围栏代码块与行内代码（保留行号），供散文检查用 ---
function stripCode(text) {
  const lines = text.split('\n');
  let inFence = false;
  const out = lines.map((line) => {
    if (/^\s*```/.test(line)) { inFence = !inFence; return ''; }
    if (inFence) return '';
    return line.replace(/`[^`]*`/g, '');
  });
  return out.join('\n');
}

function checkFile(path) {
  const raw = readFileSync(path, 'utf8');
  const prose = stripCode(raw);
  const proseLines = prose.split('\n');
  const rawLines = raw.split('\n');
  const findings = [];

  for (const rule of RULES) {
    const source = rule.skipCode ? proseLines : rawLines;
    source.forEach((line, i) => {
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(line)) !== null) {
        findings.push({ level: rule.level, line: i + 1, id: rule.id, hit: m[0].trim(), msg: rule.msg });
        if (m.index === rule.re.lastIndex) rule.re.lastIndex++;
      }
    });
  }

  // 段落开场重复（警告）：相邻段落同一开场词（前 2 字）出现 3 次以上
  const paraHeads = proseLines
    .filter((l) => l.trim() && !/^\s*([#>\-|*]|\d+\.)/.test(l))
    .map((l) => l.trim().slice(0, 2));
  const headCount = new Map();
  for (const h of paraHeads) headCount.set(h, (headCount.get(h) || 0) + 1);
  for (const [h, n] of headCount) {
    if (n >= 4 && /[\u4e00-\u9fff]/.test(h)) {
      findings.push({ level: 'warning', line: 0, id: 'para-head-repeat', hit: `「${h}」×${n}`, msg: '段落开场词高频重复' });
    }
  }

  // --- 统计层 ---
  const body = proseLines
    .filter((l) => l.trim() && !/^\s*#/.test(l))
    .join('\n');
  const hanziTotal = (body.match(/[\u4e00-\u9fff]/g) || []).length;
  const sentences = body
    .split(/[。！？!?；;\n]+/)
    .map((s) => s.trim())
    .filter((s) => (s.match(/[\u4e00-\u9fff]/g) || []).length >= 4);
  const lens = sentences.map((s) => (s.match(/[\u4e00-\u9fff]/g) || []).length);
  const n = lens.length;
  const mean = n ? lens.reduce((a, b) => a + b, 0) / n : 0;
  const sd = n > 1 ? Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : 0;
  const cv = mean ? sd / mean : 0;
  const longSentences = sentences
    .map((s, i) => ({ s, len: lens[i] }))
    .filter((x) => x.len >= 50);
  const longRate = n ? longSentences.length / n : 0;
  const connCount = CONNECTIVES.reduce((acc, c) => acc + (body.split(c).length - 1), 0);
  const connPerK = hanziTotal ? (connCount / hanziTotal) * 1000 : 0;

  const statWarnings = [];
  if (n >= 8 && cv < 0.42) statWarnings.push(`句长变异系数 ${cv.toFixed(2)} < 0.42，句长过于整齐`);
  if (connPerK > 7) statWarnings.push(`连词密度 ${connPerK.toFixed(1)}/千字 > 7，可删一半`);
  if (longRate > 0.35) statWarnings.push(`长句率 ${(longRate * 100).toFixed(0)}% 偏高，逐句检查是否多判断`);

  return {
    path,
    findings,
    longSentences: longSentences.map((x) => {
      const line = proseLines.findIndex((l) => l.includes(x.s.slice(0, 12)));
      return { line: line >= 0 ? line + 1 : 0, len: x.len, text: x.s.slice(0, 60) };
    }),
    stats: { sentences: n, hanziTotal, meanLen: mean, cv, longRate, connPerK },
    statWarnings,
  };
}

// --- 输出 ---
let totalFailure = 0;
let totalWarning = 0;
for (const f of files) {
  const r = checkFile(f);
  const failures = r.findings.filter((x) => x.level === 'failure');
  const warnings = r.findings.filter((x) => x.level === 'warning');
  totalFailure += failures.length;
  totalWarning += warnings.length + r.statWarnings.length;

  console.log(`\n=== ${r.path} ===`);
  if (!r.findings.length) console.log('（无规则命中）');
  for (const x of r.findings.sort((a, b) => a.line - b.line)) {
    const loc = x.line ? `L${x.line}` : '全文';
    console.log(`  [${x.level}] ${loc} ${x.id}: 「${x.hit}」— ${x.msg}`);
  }
  for (const w of r.statWarnings) console.log(`  [warning] 统计: ${w}`);
  if (r.longSentences.length) {
    console.log('  长句清单（≥50 汉字，人工核对，不自动判错）:');
    for (const l of r.longSentences.slice(0, 10)) {
      console.log(`    L${l.line} (${l.len} 字) ${l.text}…`);
    }
    if (r.longSentences.length > 10) console.log(`    …共 ${r.longSentences.length} 句`);
  }
  console.log(
    `  统计: 句子 ${r.stats.sentences}，汉字 ${r.stats.hanziTotal}，` +
    `平均句长 ${r.stats.meanLen.toFixed(1)}，变异系数 ${r.stats.cv.toFixed(2)}，` +
    `长句率 ${(r.stats.longRate * 100).toFixed(0)}%，连词 ${r.stats.connPerK.toFixed(1)}/千字`
  );
}

console.log(`\n合计: failure ${totalFailure}，warning ${totalWarning}`);
if (totalFailure > 0) {
  console.log('硬禁命中，需要修改后才能交稿。');
  process.exit(1);
}
console.log('未命中硬禁。警告与统计需人工判断；本结果不代表文档易读或事实正确。');
process.exit(0);
