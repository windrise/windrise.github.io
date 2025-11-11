# 🔑 API 配置指南

本系统支持**三种免费 API**用于生成论文摘要，你可以选择任意一个或配置多个作为备选。

---

## 📊 API 对比

| API 提供商 | 免费额度 | 模型 | 速度 | 推荐度 |
|-----------|---------|------|------|--------|
| **Google Gemini** | 每分钟 15 请求 | gemini-1.5-flash | ⚡⚡⚡ 很快 | ⭐⭐⭐⭐⭐ 最推荐 |
| **Groq** | 每分钟 30 请求 | llama-3.3-70b | ⚡⚡ 快 | ⭐⭐⭐⭐ 推荐 |
| **DeepSeek** | 每天较高额度 | deepseek-chat | ⚡ 中等 | ⭐⭐⭐ 备选 |

**推荐配置**：Gemini（最稳定且免费） 或 Groq

---

## 🚀 选项 1: Google Gemini API（最推荐）

### 优势
- ✅ **完全免费**，无需信用卡
- ✅ **超大免费额度**（每天 1500 次请求）
- ✅ **速度快**，响应时间短
- ✅ **稳定可靠**，Google 官方服务
- ✅ **支持中文**

### 获取 API Key（2 分钟）

1. **访问 Google AI Studio**
   - 打开：https://aistudio.google.com/app/apikey
   - 使用 Google 账号登录

2. **创建 API Key**
   - 点击 **"Create API Key"** 或**"获取 API 密钥"**
   - 选择项目（或创建新项目）
   - 复制生成的 API key（格式：`AIzaSy...`）

3. **添加到 GitHub Secrets**
   - 进入仓库：Settings → Secrets and variables → Actions
   - 点击 **"New repository secret"**
   - **Name**: `GEMINI_API_KEY`
   - **Value**: 粘贴你的 API key
   - 点击 **"Add secret"**

✅ **完成！** Gemini API 已配置

---

## 🚀 选项 2: Groq API

### 优势
- ✅ 免费使用
- ✅ 速度极快（专用硬件加速）
- ✅ 支持最新 Llama 模型

### 获取 API Key

1. 访问：https://console.groq.com/
2. 注册账号（免费）
3. 点击 **"API Keys"** → **"Create API Key"**
4. 复制 key（格式：`gsk_...`）

### 添加到 GitHub

- **Name**: `GROQ_API_KEY`
- **Value**: 你的 API key

---

## 🚀 选项 3: DeepSeek API

### 优势
- ✅ 中国团队开发，支持好
- ✅ 较大免费额度
- ✅ OpenAI 兼容接口

### 获取 API Key

1. 访问：https://platform.deepseek.com/
2. 注册账号
3. 获取 API key

### 添加到 GitHub

- **Name**: `DEEPSEEK_API_KEY`
- **Value**: 你的 API key

---

## ⚙️ 使用配置

### 自动模式（推荐）

系统会自动按以下顺序尝试：
1. Gemini（如果配置了 `GEMINI_API_KEY`）
2. Groq（如果配置了 `GROQ_API_KEY`）
3. DeepSeek（如果配置了 `DEEPSEEK_API_KEY`）
4. 降级模式（使用原始 abstract）

**不需要额外配置**，只要添加任意一个 API key 即可！

### 指定 API（可选）

如果你想强制使用特定 API，可以修改 workflow：

```yaml
- name: Generate AI summaries
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  run: |
    python scripts/generate_summaries_multi.py --provider gemini
```

可选值：`gemini`, `groq`, `deepseek`, `auto`（默认）

---

## 🔄 更新 Workflow

将原来的摘要生成步骤更新为使用多 API 版本：

```yaml
- name: Step 3 - Generate AI summaries
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
    GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
    DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
  run: |
    echo "🤖 Generating AI summaries..."
    python scripts/generate_summaries_multi.py
```

---

## 🧪 测试 API

### 本地测试

```bash
# 安装依赖
pip install google-generativeai groq openai

# 设置 API key
export GEMINI_API_KEY='your-key-here'

# 测试
python scripts/generate_summaries_multi.py --provider gemini
```

### 检查配置

```bash
# 检查已配置的 API
python -c "
import os
print('Gemini:', '✅' if os.getenv('GEMINI_API_KEY') else '❌')
print('Groq:', '✅' if os.getenv('GROQ_API_KEY') else '❌')
print('DeepSeek:', '✅' if os.getenv('DEEPSEEK_API_KEY') else '❌')
"
```

---

## 💡 推荐配置

### 最佳实践：配置 Gemini

**为什么选 Gemini？**
1. 完全免费，无需信用卡
2. Google 官方服务，稳定可靠
3. 每天 1500 次免费请求（足够用）
4. 响应速度快
5. 中文支持好

**配置步骤**（仅需 2 分钟）：
1. https://aistudio.google.com/app/apikey → 创建 API key
2. GitHub Secrets → 添加 `GEMINI_API_KEY`
3. 完成！

---

## 🆚 多 API 对比

### 速度测试
- Gemini: ~1-2 秒/论文
- Groq: ~1-3 秒/论文
- DeepSeek: ~2-4 秒/论文

### 稳定性
- Gemini: ⭐⭐⭐⭐⭐ 最稳定
- Groq: ⭐⭐⭐⭐ 偶尔模型更新
- DeepSeek: ⭐⭐⭐ 可能限流

### 成本
- 全部免费！✅

---

## 🔧 故障排除

### 问题 1: API key 无效

**症状**：`❌ Failed to initialize`

**解决**：
1. 检查 Secret 名称是否正确（`GEMINI_API_KEY`）
2. 检查 API key 是否完整（没有空格）
3. 重新生成 API key

### 问题 2: 速率限制

**症状**：`rate_limit` 错误

**解决**：
- 系统会自动重试
- 或配置第二个 API 作为备选

### 问题 3: 所有 API 都失败

**症状**：`Using fallback mode`

**结果**：
- 系统会使用原始 abstract
- 功能正常，只是没有 AI 摘要

---

## ✅ 快速开始

**最简单的方法**：

1. 获取 Gemini API key：https://aistudio.google.com/app/apikey
2. 添加到 GitHub Secrets：`GEMINI_API_KEY`
3. 运行 workflow

**就这么简单！** 🎉

---

## 📚 相关文档

- [快速开始指南](./QUICK_START.md)
- [故障排除](./TROUBLESHOOTING.md)
- [完整设置指南](./SETUP_GUIDE.md)
