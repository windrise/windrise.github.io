# Xueming Fu - Personal Website

Personal academic website powered by Hugo and the Hugo Academic (Wowchemy) theme, featuring an automated paper collection and management system.

## Overview

This is a professional academic website featuring:
- Personal biography and research interests
- Publications showcase
- Project portfolio
- Research experience timeline
- Skills and expertise
- Contact information
- **Automated Paper Collection System** - AI-powered paper discovery, filtering, and management

## Quick Start

### Prerequisites
- Hugo Extended (v0.110.0 or later)
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/windrise/windrise.github.io.git
cd windrise.github.io
```

2. Start the Hugo development server:
```bash
hugo server -D
```

3. Open your browser and visit `http://localhost:1313`

## Customization Guide

### 1. Update Personal Information

Edit `content/authors/admin/_index.md` to update:
- Your name and title
- Bio and research interests
- Education background
- Social media links
- Email and contact info

### 2. Add Your Publications

Create new publication entries in `content/publication/`:
```bash
hugo new content/publication/my-paper/index.md
```

Edit the generated file with your publication details:
- Title, authors, date
- Journal/conference name
- Abstract and summary
- PDF, code, and other links

### 3. Update Projects

Add project entries in `content/project/`:
```bash
hugo new content/project/my-project/index.md
```

### 4. Modify Experience

Edit `content/home/experience.md` to add your:
- Education history
- Work experience
- Research positions
- Internships

### 5. Update Skills

Edit `content/home/skills.md` to showcase your:
- Technical skills
- Programming languages
- Tools and frameworks
- Research expertise

### 6. Change Theme and Colors

Edit `config/_default/params.yaml` to customize:
- Theme (day/night mode)
- Font family and size
- Color scheme
- Layout options

### 7. Update Navigation Menu

Edit `config/_default/menus.yaml` to modify the navigation bar links.

### 8. Add Your Photo

Replace the avatar image:
```bash
static/img/avatar.jpg
```

## Deployment

### GitHub Pages

1. Push your changes to GitHub:
```bash
git add .
git commit -m "Update personal website"
git push origin main
```

2. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Set source to "GitHub Actions" or "main branch"

3. Your site will be available at: `https://windrise.github.io`

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `hugo --gc --minify`
3. Set publish directory: `public`
4. Deploy!

## File Structure

```
.
├── config/          # Site configuration
│   └── _default/
│       ├── config.yaml   # Main config
│       ├── params.yaml   # Theme parameters
│       ├── menus.yaml    # Navigation menus
│       └── languages.yaml
├── content/         # Your content
│   ├── authors/     # Author profiles
│   ├── home/        # Homepage widgets
│   ├── publication/ # Publications
│   └── project/     # Projects
├── static/          # Static files
│   └── img/         # Images
└── themes/          # Hugo themes
```

## Tips

- **Images**: Add images to `static/img/` or within specific content folders
- **SEO**: Update meta descriptions in `config/_default/params.yaml`
- **Analytics**: Add Google Analytics ID in params.yaml
- **Comments**: Enable Disqus or other comment systems in params.yaml

## Resources

- [Hugo Academic Documentation](https://wowchemy.com/docs/)
- [Hugo Documentation](https://gohugo.io/documentation/)
- [Markdown Guide](https://www.markdownguide.org/)

## License

This website is powered by the [Hugo Academic theme](https://github.com/wowchemy/wowchemy-hugo-themes).

## Contact

For questions or suggestions, please contact: your.email@example.com

---

## 📊 Automated Paper Collection System - Implementation Status

### 🎯 Project Overview

An AI-powered system that automatically discovers, filters, and manages academic papers from arXiv, completely free and running on GitHub Actions.

### ✅ Completed Features (Weeks 1-2)

#### Week 1: Core Automation Pipeline
- ✅ **arXiv Scraper** (`scripts/arxiv_scraper.py`)
  - Daily automated fetching from arXiv
  - Category filtering (cs.CV, cs.LG, eess.IV)
  - Keyword matching for research areas
  - Smart date-based querying

- ✅ **Smart Filter System** (`scripts/smart_filter.py`)
  - Multi-dimensional scoring (field match, venue quality, citations, code, practicality)
  - Weighted ranking algorithm
  - Top N paper selection (default: 10 papers/day)
  - Detailed score breakdown

- ✅ **GitHub Actions Workflows**
  - `daily-paper-update.yml` - Daily automated pipeline
  - `process-approved-papers.yml` - Process approved papers
  - `hugo.yml` - Website deployment

#### Week 2: AI Enhancement
- ✅ **Multi-API AI Summaries** (`scripts/generate_summaries_multi.py`)
  - Support for 7+ API providers:
    - Google Gemini (Free) ⭐
    - Groq (Free) ⭐
    - DeepSeek (Cheap)
    - ZhipuAI (Free) ⭐
    - OpenAI GPT
    - Anthropic Claude
    - Moonshot Kimi
  - Auto-fallback mechanism
  - 3-5 sentence summaries
  - Key contributions extraction
  - Bilingual support ready

- ✅ **Audio Generation** (`scripts/generate_audio.py`)
  - Text-to-speech using Edge TTS (Free)
  - Multiple voice options
  - MP3 format output

- ✅ **Review System** (`scripts/create_review_issue.py`)
  - Auto-creates GitHub Issues for paper review
  - Beautiful markdown formatting
  - Label-based approval workflow
  - Paper metadata display

- ✅ **Paper Management** (`scripts/process_approved_papers.py`)
  - Auto-categorization
  - YAML database integration
  - Duplicate prevention
  - Metadata management

### 🚧 Remaining Tasks (Week 3+)

#### Priority 0: Papers Website Enhancement ✅ 核心功能已完成

参考网站：https://mrnerf.github.io/awesome-3D-gaussian-splatting/

**文件：** `layouts/shortcodes/all-papers-enhanced.html`, `static/css/papers-dark-mode.css`

**阶段 1：基础 UI 改进** ✅ 完成
- ✅ 改进论文卡片布局
  - 优化卡片样式和悬停效果（translateY(-4px)动画）
  - 响应式设计优化
  - 改进的徽章系统（分类、会议、类型、相关性）
  - 📌 待完成：添加论文缩略图支持（需要 arXiv API 或自动生成）

- ✅ 摘要展开/折叠功能
  - "Show Abstract" / "Hide Abstract" 按钮
  - 平滑的展开/收起动画
  - 切换状态管理（data-expanded）

**阶段 2：搜索和过滤系统** ✅ 完成
- ✅ 实时搜索功能
  - 搜索框 UI（带清除按钮 ×）
  - 实时过滤标题、作者、摘要（基于 data-search-text）
  - 即时结果更新和计数

- ✅ 高级过滤器
  - 年份过滤（动态生成所有年份）
  - 分类/标签多选过滤（带图标和颜色）
  - 快速过滤器（⭐ Starred、💻 Has Code、🏆 Foundation）
  - 所有过滤器组合工作

- ✅ 排序功能
  - 按日期排序（新→旧 / 旧→新）
  - 按相关性评分排序
  - 按引用数排序
  - 按标题字母顺序排序（A-Z）

- ✅ UI 反馈
  - 结果计数实时更新（"Showing X papers"）
  - 无结果提示页面
  - 重置所有过滤器按钮（🔄 Reset All）
  - 返回顶部按钮（↑，滚动 >300px 时显示）

**阶段 3：高级交互功能** ✅ 选择功能完成
- ✅ 深色模式支持
  - 自动检测系统主题（`@media (prefers-color-scheme: dark)`）
  - 所有组件完整适配深色模式（Slate 配色）
  - 优化的深色配色方案（背景 #1e293b，卡片 #0f172a）
  - 📌 待完成：手动切换开关和 localStorage 主题持久化

- ✅ UI 增强
  - 返回顶部按钮（带渐变背景和悬停动画）
  - 浮动操作按钮组（返回顶部 + 全选可见论文）
  - 📌 待完成：滚动进度指示器（顶部进度条）

- ✅ **选择和分享模式**（NEW! 刚刚实现）
  - ✅ 多选论文功能（checkbox，Selection Mode 切换）
  - ✅ 选中论文预览栏（固定在顶部，sticky positioning）
  - ✅ 生成分享链接（URL hash: `#selected=id1,id2,id3`）
  - ✅ 导出选中论文：
    - BibTeX 格式（.bib 文件）
    - JSON 格式（.json 文件）
    - Markdown 格式（.md 文件）
  - ✅ 分享模态框（复制链接到剪贴板）
  - ✅ 从 URL 加载选中状态（分享链接支持）
  - ✅ 全选可见论文功能

**阶段 4：阅读笔记系统** 📝 设计已完成，待实现

**设计文档：** `docs/READING_NOTES_DESIGN.md`

- ✅ **笔记数据结构设计**（NEW! 设计已完成）
  - 完整的 YAML schema 定义
  - 包含字段：status, priority, progress, rating, notes, highlights, tags, todos
  - 支持 Markdown 格式笔记
  - 笔记元数据（创建时间、更新时间、版本）
  - 笔记与论文关联

- 📋 **笔记编辑界面**（计划中 - Phase 2）
  - 全屏/侧边栏笔记模态框
  - 集成 Markdown 编辑器（SimpleMDE 或类似）
  - 实时预览（Markdown → HTML）
  - 自动保存草稿（LocalStorage）
  - 格式化工具栏
  - 状态管理（to-read, reading, completed）
  - 进度追踪（0-100%）
  - 星级评分（1-5 星）

- 📋 **笔记展示**（计划中 - Phase 3）
  - 论文卡片显示笔记指示器（badge）
  - 专门的笔记视图页面（`/papers/notes/`）
  - 笔记搜索和过滤（按标签、状态、评分）
  - 笔记时间线和统计
  - 阅读进度仪表板

- 📋 **笔记高级功能**（计划中 - Phase 3-4）
  - 高亮系统（带颜色和注释）
  - 待办事项（To-Do）集成
  - 标签管理和标签云
  - 笔记导出（Markdown, PDF）
  - 笔记分享链接
  - 版本控制和历史记录
  - 笔记统计仪表板

**实施方案：**
- Phase 1: 基础笔记（文本框 + 状态 + 评分）
- Phase 2: Markdown 编辑器 + 自动保存
- Phase 3: 高亮 + 待办 + 标签
- Phase 4: 协作和高级功能

**存储方案：**
- Hybrid 模式：LocalStorage（草稿）+ GitHub（持久化）
- 自动保存：每 5 秒保存到 LocalStorage
- 手动保存：提交到 `papers.yaml` via GitHub

**阶段 5：可视化增强**
- [ ] 论文关系图
  - 基于引用的关系网络
  - 基于主题的聚类可视化
  - 交互式探索

- [ ] 统计图表
  - 每月添加论文趋势
  - 研究领域分布饼图
  - 会议/期刊统计
  - 阅读进度追踪

- [ ] 时间线视图
  - 论文时间线展示
  - 研究进展可视化
  - 里程碑标记

#### Priority 1: Essential Features
- [ ] **Mindmap Generation** (Week 2, Day 11-12)
  - Auto-generate paper structure visualization
  - Using Mermaid.js for web integration
  - Interactive expand/collapse
  - Export to Hugo pages

- [ ] **Citation Tracking** (Week 3, Day 18-19)
  - Integration with Semantic Scholar API (Free)
  - Auto-update citation counts
  - Trend visualization
  - Weekly update schedule
  - Impact tracking over time

#### Priority 2: Advanced Features
- [ ] **Local Q&A System** (Week 3, Day 15-17)
  - ChromaDB for vector storage
  - Ollama + Llama 3.1 for local LLM
  - Paper content indexing
  - Web interface for queries
  - Can run on GitHub Codespaces (60 hours/month free)

- [ ] **Enhanced Management Interface** (Week 3, Day 20-21)
  - Web-based admin panel (Hugo Admin)
  - CLI tool improvements
  - Batch operations
  - Statistics dashboard

#### Priority 3: Nice-to-Have Features
- [ ] **Weekly/Monthly Summary Reports**
  - Auto-generate research trend reports
  - Top papers of the week/month
  - Category breakdowns
  - Email/Slack notifications

- [ ] **Paper Recommendations**
  - Based on your collection
  - Similar paper suggestions
  - Author tracking
  - Conference/journal tracking

- [ ] **Enhanced Visualizations**
  - Research field timeline
  - Citation network graphs
  - Keyword trend analysis
  - Author collaboration networks

- [ ] **Mobile App**
  - Progressive Web App (PWA)
  - Offline reading support
  - Push notifications
  - Audio playback

### 📝 Next Development Session TODO

**Papers Enhancement - 剩余任务：**

1. **阅读笔记系统 - Phase 1** ⭐ 下一步（优先级：最高）
   ```bash
   # 创建基础笔记组件
   touch layouts/shortcodes/paper-notes-modal.html
   touch static/js/notes-manager.js

   # 更新 papers.yaml schema（添加示例）
   # 参考 docs/READING_NOTES_DESIGN.md
   ```

   实施步骤：
   - [ ] 创建笔记模态框 UI
   - [ ] 添加基础文本编辑区
   - [ ] 实现状态选择器（to-read, reading, completed）
   - [ ] 添加星级评分组件
   - [ ] LocalStorage 保存/加载
   - [ ] 在论文卡片添加"笔记"按钮
   - [ ] 显示笔记状态 badge

2. **阅读笔记系统 - Phase 2**（后续）
   - [ ] 集成 SimpleMDE Markdown 编辑器
   - [ ] 实时预览功能
   - [ ] 自动保存（每 5 秒）
   - [ ] 同步到 GitHub（手动保存按钮）

3. **论文缩略图支持**（优先级：中）
   - 从 arXiv 提取第一页作为缩略图
   - 或使用基于分类的默认图标
   - 添加懒加载（Intersection Observer）

4. **主题切换增强**（优先级：低）
   - 手动主题切换按钮
   - localStorage 主题持久化
   - 平滑的主题切换动画

5. **可视化增强**（优先级：低）
   - 论文关系图（基于引用）
   - 统计图表（Chart.js）
   - 时间线视图

**已完成功能总结：**
- ✅ 搜索和过滤系统（完整）
- ✅ 排序功能（5种排序方式）
- ✅ 深色模式（自动检测）
- ✅ 选择和分享功能（URL分享 + 3种导出格式）
- ✅ 摘要展开/折叠
- ✅ 响应式设计
- ✅ 阅读笔记系统设计文档

---

**其他自动化功能 - TODO：**

1. **Mindmap Generator** (Highest Priority)
   ```bash
   # Create script
   touch scripts/generate_mindmap.py

   # Install dependencies
   pip install markdown beautifulsoup4

   # Add to daily workflow
   # Edit .github/workflows/daily-paper-update.yml
   ```
   - Parse paper structure from abstract/sections
   - Generate Mermaid.js syntax
   - Integrate into Hugo shortcodes
   - Test with existing papers

2. **Citation Tracker**
   ```bash
   # Create script
   touch scripts/citation_tracker.py

   # Install dependencies
   pip install requests aiohttp

   # Create weekly workflow
   touch .github/workflows/weekly-citation-update.yml
   ```
   - Semantic Scholar API integration
   - Update papers.yaml with citation counts
   - Generate trend charts
   - Alert on high-impact papers

3. **Q&A System Setup**
   - Document Ollama installation guide
   - Create ChromaDB setup script
   - Build simple web interface
   - Test locally first

### 🔧 Quick Commands

```bash
# Run the full pipeline manually
./scripts/test_pipeline.sh

# Test API keys
./scripts/test_api.sh

# Scrape papers (test mode)
python scripts/arxiv_scraper.py --days 1 --max-results 20

# Filter papers
python scripts/smart_filter.py --top-n 10

# Generate summaries (auto-select API)
python scripts/generate_summaries_multi.py --provider auto

# Create review issue
python scripts/create_review_issue.py

# Process approved papers (after labeling issue)
python scripts/process_approved_papers.py --issue-number 123
```

### 📚 Documentation

Detailed guides available in `/docs/`:
- `QUICK_START.md` - Get started in 5 minutes
- `SETUP_GUIDE.md` - Complete setup instructions
- `API_SETUP.md` - API key configuration
- `PAPER_AUTOMATION_PLAN.md` - Full automation strategy
- `TROUBLESHOOTING.md` - Common issues and solutions

### 🎯 Success Metrics

Current achievements:
- ✅ 100% automated paper discovery
- ✅ Zero-cost operation (all free APIs)
- ✅ ~10 minutes daily review time
- ✅ Multi-API fallback for reliability
- ✅ Full GitHub integration

Target metrics:
- 5-10 papers reviewed daily
- 2-3 papers added to collection weekly
- 100% uptime with GitHub Actions
- <15 minutes daily maintenance

### 🆓 Cost Breakdown

| Service | Monthly Cost | Usage |
|---------|-------------|--------|
| GitHub Actions | $0 | 2000 min/month free |
| API Keys (Gemini/Groq/Zhipu) | $0 | Free tiers |
| Edge TTS Audio | $0 | Unlimited |
| GitHub Pages Hosting | $0 | Unlimited |
| Storage (Git) | $0 | Unlimited for text |
| **TOTAL** | **$0/month** | 🎉 |

### 🚀 Future Enhancements

Ideas for later:
- Integration with Zotero/Mendeley
- Automated literature review generation
- Paper relationship graphs
- Collaborative filtering with other researchers
- RSS feed generation
- Social media auto-posting
- Conference deadline tracking

---

### 📌 Important Notes

1. **API Keys Required**: Set up at least one free API key (Gemini, Groq, or ZhipuAI)
2. **GitHub Secrets**: Add API keys to repository secrets
3. **Daily Review**: Check GitHub Issues daily for new papers
4. **Label System**: Use `approved`, `rejected`, `starred` labels
5. **Backup**: All data in `data/papers/papers.yaml` is version controlled

For detailed implementation plans, see `docs/PAPER_AUTOMATION_PLAN.md`