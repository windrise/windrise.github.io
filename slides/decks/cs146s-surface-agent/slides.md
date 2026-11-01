---
theme: default
title: CS146S · 从 3D 编辑理解可靠 Agent
info: 从 Agent loop 到任务合同，前两节图解与练习。
routerMode: hash
wakeLock: false
transition: fade
colorSchema: light
fonts:
  provider: none
  sans: system-ui
  serif: Georgia
drawings:
  persist: false
---
<div class="kicker">CS146S · PROJECT LEARNING / 01—02</div>

# 为什么 Agent 说完成，<br>还不够？

<div class="lead">从一次局部上色，学会把意图变成可信交付。</div>

<div class="cover-chain"><span>意图</span><b>→</b><span>动作</span><b>→</b><span>状态</span><b>→</b><span>证据</span></div>

<div class="meta">Fall 2026 课程学习辅导 · 抽象 3D 表面编辑案例<br>个人原创教学材料，非官方课件；不含真实项目数据。</div>

<a class="guide" href="./guide.html" target="_blank">手机阅读 / 完整讲义 ↗</a>

---

<div class="kicker">学习地图</div>

# 八节课，一条交付链

<div class="roadmap"><div class="ready"><b>01 证据链</b><span>模型宣称 ≠ 工具执行</span></div><div class="ready"><b>02 任务合同</b><span>目标、起点、保护、验收</span></div><div><b>03 工具与 Skills</b><span>接口与操作方法</span></div><div><b>04 状态与恢复</b><span>版本、交接、仓库说明</span></div><div><b>05 测试与评审</b><span>反例、真实消费端</span></div><div><b>06 安全与失败</b><span>信任、权限、异常</span></div><div><b>07 多 Agent 协作</b><span>分工与单一写入者</span></div><div><b>08 成本与交付</b><span>路由、预算、完整闭环</span></div></div>

<div class="callout">前两节可学；后六节为规划。每节：问题 → 图解 → 练习 → 反馈。</div>

---

<div class="kicker">01 / 先判断，再揭晓</div>

# “纹理已经改蓝。”你相信吗？

<div class="quote">日志里没有编辑工具执行记录，只有这句话。</div>

<div class="two"><div class="card"><b>问题 A</b><p>现在能确认什么？<br>还不能确认什么？</p></div><div class="card"><b>问题 B</b><p>最先检查哪两项证据？<br>先自己回答，再去第 8 页。</p></div></div>

<div class="foot">提示：缺少日志不等于已经证明“没改”；先核对记录覆盖与实际产物。</div>

---

<div class="kicker">01 / 核心机制</div>

# 模型提出动作，运行器执行动作

<img class="diagram" src="/figures/agent-loop.svg" alt="模型提出请求，经运行器检查调用工具，观察反馈；不允许的请求被拒绝" />

<div class="callout">一次请求可以被拒绝、失败或等待。模型后面的文字不能改写执行事实。</div>

<div class="foot">官方最小示例：文本工具请求 → Python 解析分派 → 结果回填；这里只读机制，不运行示例。</div>

---

<div class="kicker">01 / 证据强度</div>

# 四层证据，各自回答不同问题

<img class="diagram" src="/figures/evidence.svg" alt="从宣称、请求、执行到验收的四层证据" />

<div class="callout">“工具成功”只说明动作成功，不自动说明颜色、保护区和最终文件都合格。</div>

---

<div class="kicker">01 / 放进 3D 编辑任务</div>

# 改目标区，还要守住保护区

<img class="diagram" src="/figures/surface.svg" alt="抽象圆柱表面中的蓝色目标带和不允许修改的保护区" />

<div class="two compact"><div class="card"><b>动作证据</b><p>对哪个父版本，生成了哪个候选？</p></div><div class="card"><b>结果证据</b><p>按真实采样方式回读，目标和保护是否都满足？</p></div></div>

---

<div class="kicker">01 / 练习</div>

# 三条轨迹，三种结论

<div class="cases"><div><b>A</b><span>“已完成。”<br>没有工具记录。</span></div><div><b>B</b><span>请求编辑 → 被拒绝。<br>随后声称完成。</span></div><div><b>C</b><span>内存替换 → 候选 B。<br>回读字符串 blue；未检查保护。</span></div></div>

<div class="callout">分别判断：请求发生了吗？执行成功了吗？哪些目标已被证据支持？</div>

<div class="foot">以上均为教学模拟。C 的简化检查仍不代表完整纹理质量验收。</div>

---

<div class="kicker">01 / 参考答案</div>

# 先找执行回执，再核对实际结果

<div class="answers"><p><b>A：</b>只有宣称。需核查记录覆盖和实际产物，不能确认成功。</p><p><b>B：</b>请求存在，但这次执行被拒绝。“完成”没有依据。</p><p><b>C：</b>只支持 B 的内存字符串已变为 blue；不支持保护区或真实纹理合格。</p></div>

<div class="callout">通过标准：能把“谁说的、做了什么、检查了哪个版本”分别说清。</div>

<a class="guide" href="./guide.html#lesson-1" target="_blank">展开第一节完整解释与练习 ↗</a>

---

<div class="kicker">02 / 从模糊要求开始</div>

# “把背面的条纹接顺一点。”

<div class="quote">前面不要变，做完直接用。</div>

<div class="three"><div class="card"><b>哪一个状态？</b><p>哪个资产、哪个父版本？</p></div><div class="card"><b>什么叫接顺？</b><p>断裂、方向还是颜色？</p></div><div class="card"><b>直接用是什么？</b><p>候选、接受还是发布？</p></div></div>

<div class="foot">不凭一句模糊要求自定验收阈值，也不擅自增加发布权限。</div>

---

<div class="kicker">02 / 核心机制</div>

# 合同固定目标，不锁死全部方法

<img class="diagram" src="/figures/contract.svg" alt="任务合同的目标、起点、保护、动作、证据五个部分" />

<div class="callout">好的上下文不一定很长，但要让不同执行者追求同一个结果。</div>

---

<div class="kicker">02 / 可以复用的合同卡</div>

# 先写事实，再把缺口留出来

<div class="contract"><div><b>起点</b><span>资产身份、父版本、当前状态</span></div><div><b>目标与保护</b><span>编辑对象、不可改变区域、既定指标</span></div><div><b>允许动作</b><span>可用接口、范围、接受与发布边界</span></div><div><b>验收与异常</b><span>检查哪个候选、失败后停止或返回什么</span></div></div>

<div class="callout">“未确定”是合法状态。缺关键事实时，它还是合同草案，不是执行通行证。</div>

---

<div class="kicker">02 / 谁负责哪一种约束？</div>

# 文档告诉它该做什么，边界限制它能做什么

<img class="diagram" src="/figures/responsibility.svg" alt="文档说明、运行时权限、确定性检查和判断各自的职责" />

<div class="callout">AGENTS.md、Skill 或 Hook 的名字本身，不是沙箱或安全保证。</div>

---

<div class="kicker">02 / 失败反例一</div>

# 报告通过了，可它检查的是哪个版本？

<img class="diagram" src="/figures/versions.svg" alt="父版本A生成候选B，B验收通过；之后产生C，不能用B报告为C背书" />

<div class="callout">当前版本、候选版本、被测版本必须绑定。只写“最新版”不够。</div>

---

<div class="kicker">02 / 失败反例二</div>

# 十页提示词，也挡不住一个过宽的工具

<div class="two"><div class="card warn"><b>只有文字</b><p>“不要改保护区。”<br>工具却能写入整张纹理。</p></div><div class="card"><b>可执行的约束</b><p>明确作用范围、检查保护区、<br>拒绝越界候选。</p></div></div>

<div class="callout">提示词用于解释要求，工具与检查负责落实可以确定的边界。</div>

<div class="foot">这是教学反例，不表示任何真实项目已发生此故障。</div>

---

<div class="kicker">02 / 你的练习</div>

# 补齐“接顺条纹”的任务合同

<div class="exercise"><b>交付两个小东西</b><p>① 三个必须查证的问题。<br>② 一个不会擅自编辑或发布的安全第一步。</p></div>

<div class="callout">先查既有资料，能确认的不用重复问；影响目标或权限的缺口再澄清。</div>

<a class="guide" href="./guide.html#lesson-2" target="_blank">写完后，去讲义展开参考答案 ↗</a>

---

<div class="kicker">带走两个判断</div>

# 可靠 Agent，从这两句话开始

<div class="takeaway"><p>“完成”的结论，必须有绑定版本的证据。</p><p>任务合同，必须同时说明目标与边界。</p></div>

<div class="sources"><a href="https://themodernsoftware.dev/" target="_blank">课程主页</a> · <a href="https://docs.google.com/document/d/1W11sWBigWIsi9wVIhhFx3wajIEnP0Qfb-ei8Ecf5VKU/edit" target="_blank">FA26 大纲</a> · <a href="https://drive.google.com/file/d/1DxKa_autBOu9s8DvItodgUAwH_pBg7aR/view" target="_blank">最小循环源码</a> · <a href="https://docs.google.com/presentation/d/1RZu-p18Qybbgm8WVP2RH04ESc4Bn377B-T9j5-TBFdQ/edit" target="_blank">9/24 讲义</a></div>

<div class="foot">下一节规划：CLI / MCP / Skill 的职责。没有自动执行真实项目的按钮。<br>打开材料不等于完成学习；可以把练习答案带回对话，我们一起复盘。</div>

<a class="guide" href="./guide.html" target="_blank">完整讲义 ↗</a> · <a href="../">返回在线目录</a>

<style>
.slidev-layout{background:#f6f5ef;color:#163145;padding:38px 52px;font-family:system-ui,"PingFang SC",sans-serif}.slidev-layout h1{font-size:34px;line-height:1.35;font-weight:730;margin:12px 0 24px;letter-spacing:-.7px}.kicker{font-size:12px;letter-spacing:2px;color:#147d79;font-weight:750}.lead{font-size:23px;color:#486374;margin-top:24px}.meta,.foot{font-size:14px;line-height:1.6;color:#607583;margin-top:20px}.cover-chain{display:flex;align-items:center;gap:20px;margin:42px 0}.cover-chain span{background:#fff;border:1px solid #d4e1df;padding:16px 28px;border-radius:12px;font-size:23px}.cover-chain b{color:#178980}.guide{display:inline-block;font-size:16px;color:#087970!important;margin-top:16px;border-bottom:1px solid #087970!important}.roadmap{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.roadmap>div{padding:18px 14px;background:#fff;border:1px solid #dce3e3;border-radius:10px;min-height:100px}.roadmap b{font-size:17px;display:block}.roadmap span{font-size:13px;display:block;margin-top:12px;color:#637c88}.roadmap .ready{border-top:4px solid #15887e}.callout{margin-top:24px;padding:14px 18px;background:#e1eeea;border-radius:8px;font-size:18px;line-height:1.6}.quote{font-size:28px;border-left:5px solid #d19b42;padding:22px;background:#fff;margin:24px 0}.two,.three{display:grid;gap:18px;grid-template-columns:repeat(2,1fr)}.three{grid-template-columns:repeat(3,1fr)}.card{padding:22px;background:#fff;border:1px solid #dce3e3;border-radius:12px;font-size:21px}.card p{font-size:18px;line-height:1.7;color:#4d6572;margin:12px 0 0}.compact .card{padding:14px;font-size:17px}.compact .card p{font-size:15px;margin-top:6px}.diagram{width:100%;height:258px;object-fit:contain;margin:0 auto}.cases{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.cases>div{border:1px solid #d6e2e1;background:#fff;padding:22px;border-radius:12px;min-height:180px}.cases b{font-size:30px;color:#16837d;display:block}.cases span{font-size:19px;line-height:1.7;display:block;margin-top:14px}.answers p{padding:12px 18px;background:#fff;border-radius:8px;font-size:19px;line-height:1.5;margin:12px 0}.answers b{color:#087970}.contract{display:grid;grid-template-columns:1fr 1fr;gap:16px}.contract>div{border-left:4px solid #16837d;padding:16px;background:#fff;border-radius:8px}.contract b{font-size:20px;display:block}.contract span{font-size:17px;display:block;margin-top:10px}.warn{border-color:#d8ad62}.exercise{padding:28px;background:#fff;border-radius:12px;font-size:23px}.exercise p{font-size:21px;line-height:1.8}.takeaway{font-size:27px;line-height:1.6;margin:36px 0}.takeaway p{padding-left:18px;border-left:4px solid #18877e}.sources{font-size:16px}.slidev-layout a{color:#087970}
</style>
