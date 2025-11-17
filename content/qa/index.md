---
title: "Q&A System"
type: page
date: 2025-01-17
---

<link rel="stylesheet" href="/css/papers-dark-mode.css">

# 💬 LLM-Powered Q&A System

Ask questions about your research paper collection and get AI-powered answers.

<div class="qa-container">
  <div class="qa-input-section">
    <h2>Ask a Question</h2>
    <form id="qa-form" onsubmit="handleSubmit(event)">
      <div class="input-group">
        <textarea
          id="question-input"
          placeholder="e.g., What are the latest advances in 3D Gaussian Splatting?"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="options-group">
        <label>
          Context Papers:
          <select id="context-count">
            <option value="3">3</option>
            <option value="5" selected>5</option>
            <option value="7">7</option>
            <option value="10">10</option>
          </select>
        </label>
      </div>

      <button type="submit" id="submit-btn" class="submit-btn">
        <span id="btn-text">Ask Question</span>
        <span id="btn-spinner" class="spinner" style="display: none;"></span>
      </button>
    </form>
  </div>

  <div id="qa-result" class="qa-result" style="display: none;">
    <h2>Answer</h2>
    <div id="answer-content" class="answer-content"></div>

    <div id="sources-section" class="sources-section" style="display: none;">
      <h3>📚 Sources</h3>
      <div id="sources-list" class="sources-list"></div>
    </div>
  </div>

  <div id="qa-error" class="qa-error" style="display: none;">
    <h2>Error</h2>
    <p id="error-message"></p>
  </div>
</div>

---

## 🎯 Quick Examples

<div class="examples-grid">
  <div class="example-card" onclick="askExample('What are the key differences between NeRF and Gaussian Splatting?')">
    <div class="example-icon">🔍</div>
    <div class="example-text">Key differences between NeRF and Gaussian Splatting</div>
  </div>

  <div class="example-card" onclick="askExample('How do recent papers address real-time rendering?')">
    <div class="example-icon">⚡</div>
    <div class="example-text">Real-time rendering approaches</div>
  </div>

  <div class="example-card" onclick="askExample('What are the latest medical imaging techniques?')">
    <div class="example-icon">🏥</div>
    <div class="example-text">Medical imaging techniques</div>
  </div>

  <div class="example-card" onclick="askExample('Compare self-supervised learning methods')">
    <div class="example-icon">📊</div>
    <div class="example-text">Self-supervised learning comparison</div>
  </div>
</div>

---

## ⚙️ Features

<div class="features-grid">
  <div class="feature-item">
    <div class="feature-icon">🤖</div>
    <h3>AI-Powered Answers</h3>
    <p>Get natural language answers powered by Gemini or ZhipuAI</p>
  </div>

  <div class="feature-item">
    <div class="feature-icon">🔍</div>
    <h3>Semantic Search</h3>
    <p>Find relevant papers using vector similarity</p>
  </div>

  <div class="feature-item">
    <div class="feature-icon">📚</div>
    <h3>Source Citations</h3>
    <p>See which papers were used to generate the answer</p>
  </div>

  <div class="feature-item">
    <div class="feature-icon">⚡</div>
    <h3>Fast & Accurate</h3>
    <p>Optimized for quick responses with high relevance</p>
  </div>
</div>

---

## 📝 Note

This feature requires:
- Vector database setup (run `python scripts/setup_vectordb.py`)
- API keys for Gemini or ZhipuAI configured in environment variables
- Backend service running (`python scripts/llm_qa.py -i` or web server)

<style>
.qa-container {
  max-width: 900px;
  margin: 0 auto;
}

.qa-input-section {
  background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
}

.qa-input-section h2 {
  color: #667eea;
  margin-top: 0;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1em;
  resize: vertical;
  transition: border-color 0.2s;
}

.input-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.options-group {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.options-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  font-weight: 600;
}

.options-group select {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1em;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 40px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.qa-result {
  background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
  border-radius: 12px;
  padding: 30px;
  border: 1px solid #e0e0e0;
  margin-bottom: 30px;
}

.qa-result h2 {
  color: #667eea;
  margin-top: 0;
}

.answer-content {
  background: white;
  padding: 25px;
  border-radius: 8px;
  line-height: 1.8;
  color: #333;
  font-size: 1.05em;
}

.sources-section {
  margin-top: 30px;
}

.sources-section h3 {
  color: #667eea;
  margin-bottom: 15px;
}

.sources-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.source-item {
  background: white;
  border-left: 3px solid #667eea;
  padding: 15px;
  border-radius: 6px;
  transition: all 0.2s;
}

.source-item:hover {
  background: #f9f9f9;
  transform: translateX(5px);
}

.source-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.source-meta {
  font-size: 0.9em;
  color: #666;
}

.qa-error {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 20px;
  color: #856404;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.example-card {
  background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.example-card:hover {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
}

.example-icon {
  font-size: 2em;
}

.example-text {
  color: #333;
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  margin: 30px 0;
}

.feature-item {
  text-align: center;
}

.feature-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.feature-item h3 {
  color: #667eea;
  margin-bottom: 10px;
}

.feature-item p {
  color: #666;
  line-height: 1.6;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .qa-input-section, .qa-result, .example-card {
    background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
    border-color: #444;
  }

  .input-group textarea, .options-group select {
    background: #2a2a2a;
    color: #e0e0e0;
    border-color: #444;
  }

  .answer-content, .source-item {
    background: #2a2a2a;
    color: #e0e0e0;
  }

  .source-item:hover {
    background: #333;
  }

  .example-text, .source-title, .feature-item p {
    color: #e0e0e0;
  }

  .source-meta {
    color: #aaa;
  }
}
</style>

<script>
function askExample(question) {
  document.getElementById('question-input').value = question;
  document.getElementById('question-input').scrollIntoView({ behavior: 'smooth' });
}

async function handleSubmit(event) {
  event.preventDefault();

  const question = document.getElementById('question-input').value.trim();
  const contextCount = parseInt(document.getElementById('context-count').value);

  if (!question) return;

  // Show loading state
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');

  submitBtn.disabled = true;
  btnText.textContent = 'Processing...';
  btnSpinner.style.display = 'inline-block';

  // Hide previous results/errors
  document.getElementById('qa-result').style.display = 'none';
  document.getElementById('qa-error').style.display = 'none';

  try {
    // TODO: Replace with actual API endpoint
    // For now, show a message
    setTimeout(() => {
      showError('Backend service not available. Please ensure the Q&A service is running. See documentation for setup instructions.');
      submitBtn.disabled = false;
      btnText.textContent = 'Ask Question';
      btnSpinner.style.display = 'none';
    }, 1000);

    /* Actual implementation when backend is ready:
    const response = await fetch('/api/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, n_context: contextCount })
    });

    const data = await response.json();

    if (data.error) {
      showError(data.error);
    } else {
      showAnswer(data);
    }

    submitBtn.disabled = false;
    btnText.textContent = 'Ask Question';
    btnSpinner.style.display = 'none';
    */

  } catch (error) {
    showError('Failed to connect to Q&A service: ' + error.message);
    submitBtn.disabled = false;
    btnText.textContent = 'Ask Question';
    btnSpinner.style.display = 'none';
  }
}

function showAnswer(data) {
  const resultDiv = document.getElementById('qa-result');
  const answerContent = document.getElementById('answer-content');
  const sourcesSection = document.getElementById('sources-section');
  const sourcesList = document.getElementById('sources-list');

  // Show answer
  answerContent.innerHTML = data.answer.replace(/\n/g, '<br>');

  // Show sources
  if (data.sources && data.sources.length > 0) {
    sourcesList.innerHTML = data.sources.map((source, index) => `
      <div class="source-item">
        <div class="source-title">${index + 1}. ${source.title}</div>
        <div class="source-meta">
          ${source.year || 'N/A'} | Relevance: ${(source.relevance * 100).toFixed(0)}%
        </div>
      </div>
    `).join('');
    sourcesSection.style.display = 'block';
  } else {
    sourcesSection.style.display = 'none';
  }

  resultDiv.style.display = 'block';
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(message) {
  const errorDiv = document.getElementById('qa-error');
  const errorMessage = document.getElementById('error-message');

  errorMessage.textContent = message;
  errorDiv.style.display = 'block';
  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>
