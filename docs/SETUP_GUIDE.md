
# 🚀 论文自动化系统 - 设置指南

完整的零成本自动化论文收集系统设置指南。

---

## 📋 系统概览

这个系统每天自动完成：
1. ✅ 从 arXiv 抓取最新论文（50篇）
2. ✅ 智能过滤和排序（Top 10）
3. ✅ AI 生成摘要（使用 Groq免费API）
4. ✅ 生成音频讲解（使用Edge TTS免费服务）
5. ✅ 创建 GitHub Issue 供你审核
6. ✅ 审核通过后自动添加到网站

**成本：完全免费** 💰

---

## ⚙️ 快速开始（10分钟设置）

### 步骤 1：获取 Groq API Key（免费）

1. 访问 https://console.groq.com
2. 点击 **"Sign Up"** 创建免费账号
3. 登录后，点击 **"API Keys"**
4. 点击 **"Create API Key"**
5. 复制生成的 key（格式：`gsk_xxxxx...`）

**重要**：保存好这个 key，只显示一次！

---

### 步骤 2：在 GitHub 设置 Secrets

1. 进入你的仓库页面：
   ```
   https://github.com/windrise/windrise.github.io
   ```

2. 点击 **Settings** → **Secrets and variables** → **Actions**

3. 点击 **"New repository secret"**

4. 添加secret：
   - **Name**: `GROQ_API_KEY`
   - **Value**: 粘贴你的 Groq API key
   - 点击 **"Add secret"**

✅ 完成！

---

### 步骤 3：测试系统（可选）

在合并 PR 之前，你可以本地测试：

```bash
# 1. 安装依赖
cd windrise.github.io
pip install -r scripts/requirements.txt

# 2. 设置环境变量
export GROQ_API_KEY='your-groq-api-key-here'

# 3. 测试爬虫
python scripts/arxiv_scraper.py --max-results 10 --days 1

# 4. 测试过滤
python scripts/smart_filter.py --top-n 5

# 5. 测试摘要生成
python scripts/generate_summaries.py

# 6. 测试音频生成
python scripts/generate_audio.py
```

---

### 步骤 4：启用自动化

合并这个 PR 后，系统会：
- ✅ 每天 UTC 0:00（北京时间早上8点）自动运行
- ✅ 或者你可以手动触发

**手动触发方法**：
1. 进入 **Actions** 标签
2. 点击 **"Daily Paper Update"**
3. 点击 **"Run workflow"**
4. 选择分支 `main`
5. 点击 **"Run workflow"** 按钮

---

## 📖 使用流程

### 每日工作流

```
08:00 AM - GitHub Actions 自动运行
    ↓
    抓取 → 过滤 → 生成摘要 → 生成音频
    ↓
08:30 AM - 你收到 GitHub 通知
    📧 "New issue: 📚 Paper Review - 2025-01-07"
    ↓
09:00 AM - 你打开 Issue 审核（10分钟）
    ↓
    阅读 AI 摘要和评分
    ↓
    对每篇论文决定是否收录：
    ✅ 值得收录 → 点击右侧 Labels → 选择 "approved"
    ⭐ 特别重要 → 同时添加 "starred"
    ❌ 不感兴趣 → 添加 "rejected"
    ↓
09:02 AM - 🤖 自动化立即触发！
    ↓
    系统检测到 "approved" 标签
    ↓
    自动执行：
    1. 从 pending/ 读取完整论文数据
    2. 自动分类（3D Gaussian/医学影像/NeRF等）
    3. 添加到 data/papers/papers.yaml
    4. 提交更改到 main 分支
    5. 触发网站重新构建
    ↓
09:05 AM - ✅ 系统在 Issue 下自动评论
    📝 "Approved papers have been processed and added to the collection!"
    ↓
09:10 AM - 🌐 网站自动更新完成！
    ↓
    你可以在网站上看到新添加的论文了
```

---

## 🎯 审核界面示例

当系统创建 Issue 后，你会看到这样的格式：

```markdown
## 1. 3D Gaussian Splatting for Real-Time Rendering

**Score:** `8.5/10` | **arXiv:** 2308.04079

**Authors:** Kerbl et al.

**Relevance:**
- 🎯 Field Match: 10/10 - Matches: gaussian splatting, 3d gaussian, neural radiance
- 🏆 Venue: SIGGRAPH (10/10)
- 💻 Code: ✅ Available

**AI Summary:**
This paper introduces 3D Gaussian primitives for real-time rendering...

**Key Contributions:**
- Novel 3D Gaussian representation
- Real-time rendering at 30+ FPS
- State-of-the-art quality

**Actions:**
- ✅ Approve: 点击右侧 Labels → 选择 `approved` → 自动触发添加
- ❌ Reject: Add label `rejected`
- ⭐ Important: Add label `starred`

**重要**: 只要添加 `approved` 标签，系统会在 1-2 分钟内自动处理！
```

---

## 🔧 高级配置

### 自定义关键词

编辑 `scripts/arxiv_scraper.py`：

```python
self.keywords = [
    "gaussian splatting",
    "medical image",
    # 添加你的关键词
    "your custom keyword",
]
```

### 调整过滤权重

编辑 `scripts/smart_filter.py`：

```python
self.weights = {
    "field_match": 0.40,      # 调整这些权重
    "venue_quality": 0.25,
    "citation_potential": 0.15,
    "code_availability": 0.10,
    "practicality": 0.10
}
```

### 修改每日论文数量

编辑 `.github/workflows/daily-paper-update.yml`：

```yaml
- name: Step 2 - Filter and rank papers
  run: |
    python scripts/smart_filter.py --top-n 10  # 改成你想要的数量
```

---

## 🐛 故障排除

### 问题 1：Workflow 失败

**症状**：GitHub Actions 显示红色 ❌

**解决方法**：
1. 点击失败的 workflow
2. 查看错误日志
3. 最常见问题：
   - `GROQ_API_KEY` 未设置 → 检查 Step 2
   - 依赖安装失败 → 检查 `requirements.txt`

### 问题 2：没有找到论文

**症状**：Issue 显示 "Found 0 papers"

**可能原因**：
- 关键词太严格
- arXiv 当天没有匹配的论文

**解决方法**：
```bash
# 增加查询天数
python scripts/arxiv_scraper.py --days 2
```

### 问题 3：摘要生成失败

**症状**：论文没有 `ai_summaries` 字段

**解决方法**：
1. 检查 Groq API key 是否正确
2. 检查 Groq API 配额（免费版有限制但很充足）
3. 手动运行测试：
   ```bash
   export GROQ_API_KEY='your-key'
   python scripts/generate_summaries.py
   ```

### 问题 4：Issue 创建失败

**症状**：workflow 成功但没有创建 Issue

**原因**：需要 `gh` CLI

**解决方法**：
GitHub Actions 环境已经包含 `gh` CLI，应该能正常工作。
如果不行，检查 workflow 的 `permissions` 设置。

---

## 📊 系统监控

### 查看运行历史

1. 进入 **Actions** 标签
2. 点击 **"Daily Paper Update"**
3. 查看所有运行记录

### 查看统计数据

```bash
# 查看已收集的论文数量
cat data/papers/papers.yaml | grep "total_papers"

# 查看待审核的论文
ls data/papers/pending/

# 查看生成的音频
ls static/audio/
```

---

## 🎨 未来扩展

系统已经为以下功能预留了接口：

### 1. 本地问答系统（待实现）
```bash
pip install chromadb ollama
ollama pull llama3.1:8b
python scripts/setup_qa.py
```

### 2. 思维导图生成（待实现）
```bash
python scripts/generate_mindmap.py
```

### 3. 引用追踪（待实现）
```bash
python scripts/citation_tracker.py
```

### 4. 周报生成（待实现）
- 每周一发送论文摘要邮件
- 统计本周热门论文
- 生成趋势分析

---

## 💡 使用技巧

### 技巧 1：批量审核

使用 GitHub CLI 批量操作：

```bash
# 批准所有评分 > 7 的论文
gh issue list --label "paper-review" --json number,title | \
  jq -r '.[] | select(.title | contains("[8.") or contains("[9.")) | .number' | \
  xargs -I {} gh issue edit {} --add-label "approved"
```

### 技巧 2：自定义标签

创建更多标签来分类论文：
- `must-read` - 必读论文
- `related-work` - 相关工作
- `future-project` - 未来项目灵感
- `teaching` - 教学材料

### 技巧 3：邮件通知

在 GitHub 设置中启用邮件通知：
- Settings → Notifications
- 勾选 "Issues"
- 每次新 Issue 创建时收到邮件

---

## 📞 支持

如果遇到问题：

1. **查看日志**：GitHub Actions 的详细日志
2. **阅读文档**：`docs/PAPER_AUTOMATION_PLAN.md`
3. **提交 Issue**：在你的仓库创建 issue
4. **联系我**：通过邮件或 GitHub

---

## ✅ 检查清单

部署前确认：

- [ ] Groq API Key 已设置在 GitHub Secrets
- [ ] GitHub Actions 已启用
- [ ] 本地测试通过（可选）
- [ ] 理解审核流程
- [ ] 知道如何查看日志

部署后验证：

- [ ] 手动触发一次 workflow 成功
- [ ] 收到了 paper review issue
- [ ] 能看到 AI 生成的摘要
- [ ] 音频文件已生成
- [ ] 审核后论文正确添加到网站

---

## 🎉 开始使用！

现在你已经准备好了！系统会：

- ✅ 每天自动发现相关论文
- ✅ 智能过滤和排序
- ✅ 生成AI摘要和音频
- ✅ 你只需10分钟审核
- ✅ 自动更新你的网站

**完全免费，完全自动化！**

有任何问题随时查看文档或创建 issue。

Happy reading! 📚✨
