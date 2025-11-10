# 🔧 摘要生成失败 - 故障排除指南

## 问题现象

在 Paper Review Issue 中看到：
```
AI Summary: Summary generation failed.
Key Contributions: Contribution extraction failed.
```

## 根本原因

摘要生成失败通常由以下原因之一导致：

### 1. ⚠️ GROQ_API_KEY 未设置（最常见）

**症状**：所有论文的摘要都显示 "Summary generation failed."

**解决方法**：

#### 方法 A: 在 GitHub Secrets 中设置（推荐）

1. 获取 Groq API Key：
   - 访问 https://console.groq.com/
   - 注册（完全免费）
   - 点击 "API Keys"
   - 点击 "Create API Key"
   - 复制生成的 key（格式：`gsk_xxxxx...`）

2. 添加到 GitHub Secrets：
   - 进入仓库：https://github.com/windrise/windrise.github.io
   - Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - Name: `GROQ_API_KEY`
   - Value: 粘贴你的 API key
   - 点击 "Add secret"

3. 重新运行 workflow：
   - Actions → Daily Paper Update → Re-run jobs

#### 方法 B: 本地测试

```bash
# 设置环境变量
export GROQ_API_KEY='gsk_your_key_here'

# 测试 API 连接
python scripts/generate_summaries.py --test

# 手动运行摘要生成
python scripts/generate_summaries.py
```

---

### 2. 🌐 网络或 API 错误

**症状**：部分论文成功，部分失败

**现在的改进**：
- ✅ 自动重试（最多 3 次）
- ✅ 速率限制自动等待
- ✅ 降级方案（使用原始 abstract）

**检查方法**：

```bash
# 测试 API 连接
python scripts/generate_summaries.py --test
```

输出示例：
```
🔍 Testing Groq API connection...
✅ API connection successful!
   Response: Hello!
```

---

### 3. 📄 论文 Abstract 缺失

**症状**：个别论文显示 "Abstract not available."

**自动处理**：
- 如果 abstract 为空或太短，使用标题作为降级方案
- 不会导致整个流程失败

---

## 📊 改进内容

我已经改进了 `scripts/generate_summaries.py`：

### ✅ 新增功能

1. **智能重试机制**
   - 自动重试失败的 API 调用（最多 3 次）
   - 速率限制自动等待（指数退避）
   - 详细的错误日志

2. **降级方案**
   - API 失败时使用原始 abstract
   - 确保即使 AI 失败，也能显示基本信息
   - 不再显示 "Summary generation failed"

3. **API 连接测试**
   ```bash
   python scripts/generate_summaries.py --test
   ```

4. **更详细的进度报告**
   ```
   [1/10] 📝 Generating summaries for: 3D Gaussian Splatting...
      ✅ Generated 5/5 summaries successfully
   [2/10] 📝 Generating summaries for: Medical Image...
      ⚠️  Generated 3/5 summaries (fallbacks used for others)
   ```

5. **错误统计**
   ```
   ✅ Processing complete!
      Successful: 8/10
      Failed: 2/10
   ```

---

## 🔍 诊断步骤

### 步骤 1: 检查 API Key

```bash
# 在本地检查
echo $GROQ_API_KEY

# 或在 GitHub Actions 日志中查看
# 应该看到环境变量已设置（不会显示实际值）
```

### 步骤 2: 测试 API 连接

```bash
python scripts/generate_summaries.py --test
```

**成功输出**：
```
🔍 Testing Groq API connection...
✅ API connection successful!
   Response: Hello!
```

**失败输出**：
```
❌ API connection failed: Authentication error

Possible issues:
1. Invalid API key
2. Network connection problem
3. API rate limit reached
4. API service down
```

### 步骤 3: 查看 Workflow 日志

1. 进入 Actions 标签
2. 点击最近的 "Daily Paper Update" 运行
3. 展开 "Step 3 - Generate AI summaries"
4. 查找错误信息：
   - `GROQ_API_KEY not found` → 未设置 API key
   - `rate_limit` → API 速率限制（会自动重试）
   - `401` / `403` → API key 无效

---

## 🚀 快速修复

### 最快速的解决方法：

1. **获取 Groq API Key**（2 分钟）
   - https://console.groq.com/ → 注册 → Create API Key

2. **添加到 GitHub Secrets**（1 分钟）
   - Settings → Secrets → Actions → New secret
   - Name: `GROQ_API_KEY`
   - Value: 你的 key

3. **重新运行 Workflow**（1 分钟）
   - Actions → Daily Paper Update → Re-run jobs

4. **等待结果**（5-10 分钟）
   - 检查新的 Issue 是否有正确的摘要

---

## 📝 当前版本的优势

即使你**现在不设置 GROQ_API_KEY**，系统也能正常工作：

- ✅ 仍然会抓取论文
- ✅ 仍然会创建 Issue
- ✅ 显示原始 Abstract（而不是 "failed"）
- ✅ 显示论文元数据（作者、评分、链接）
- ✅ 可以正常审核和批准

只是：
- ❌ 没有 AI 生成的简洁摘要
- ❌ 没有提取的关键贡献
- ❌ 没有中文翻译

**设置 API key 后，立即获得这些功能！**

---

## 🎯 验证修复

设置 API key 后，手动触发一次 workflow：

1. Actions → Daily Paper Update → Run workflow
2. 等待完成（约 5-10 分钟）
3. 检查新创建的 Issue
4. 验证摘要是否正确生成

**成功标志**：
```
AI Summary:
This paper introduces a novel method for...

Key Contributions:
- Novel 3D representation using Gaussian primitives
- Real-time rendering at 30+ FPS
- State-of-the-art quality on multiple benchmarks
```

---

## 📞 仍然有问题？

如果按照上述步骤操作后仍然失败：

1. **检查 Groq API 状态**
   - https://status.groq.com/

2. **查看详细日志**
   - GitHub Actions 日志中搜索 "Error" 或 "Failed"

3. **手动测试**
   ```bash
   export GROQ_API_KEY='your-key'
   python scripts/generate_summaries.py --test
   ```

4. **提交 Issue**
   - 在仓库创建新 Issue
   - 附上错误日志和症状描述

---

## 🔄 未来改进

可以考虑的增强功能：

1. **备用 API** - 如果 Groq 失败，自动切换到其他免费 API
2. **缓存机制** - 缓存已生成的摘要，避免重复调用
3. **本地 LLM** - 使用本地模型（Ollama）生成摘要
4. **批量处理** - 一次性处理多篇论文，提高效率

---

**现在你应该知道如何诊断和修复摘要生成问题了！** 🎉

最重要的一步：**设置 GROQ_API_KEY**
