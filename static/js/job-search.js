/* Job Search & Auto-Apply
 * All processing happens locally in the browser.
 * Resume data is persisted to localStorage under JS_STORAGE_KEY.
 */
(function () {
  'use strict';

  const JS_STORAGE_KEY = 'job_search_resume_v1';
  const JS_BOOKMARKS_KEY = 'job_search_bookmarks_v1';

  // ---------- Field matching rules used by both parser and bookmarklet ----------
  // Each rule: keywords that may appear in a form field's name/id/label/placeholder.
  // Keep these in sync with the bookmarklet generator below.
  const FIELD_RULES = [
    { field: 'name', label: '姓名 / Full Name', keys: ['fullname', 'full-name', 'full_name', 'applicantname', 'applicant-name', 'yourname', 'your-name', 'realname', 'real-name', '姓名', 'name'] },
    { field: 'englishName', label: '英文名 / English Name', keys: ['englishname', 'english-name', 'pinyin', '英文名'] },
    { field: 'email', label: '邮箱 / Email', keys: ['email', 'e-mail', 'mail', '邮箱', '电子邮件'] },
    { field: 'phone', label: '手机 / Phone', keys: ['phone', 'mobile', 'tel', 'telephone', 'cellphone', 'contact-number', '手机', '电话', '联系方式'] },
    { field: 'gender', label: '性别 / Gender', keys: ['gender', 'sex', '性别'] },
    { field: 'birthday', label: '出生日期 / Birthday', keys: ['birthday', 'birthdate', 'dob', 'date-of-birth', 'dateofbirth', '生日', '出生日期', '出生年月'] },
    { field: 'nationality', label: '国籍 / Nationality', keys: ['nationality', 'citizenship', '国籍'] },
    { field: 'location', label: '所在地 / Location', keys: ['location', 'city', 'currentcity', '所在地', '所在城市', '当前城市'] },
    { field: 'address', label: '地址 / Address', keys: ['address', 'street', '地址', '通讯地址', '家庭地址'] },
    { field: 'linkedin', label: 'LinkedIn', keys: ['linkedin'] },
    { field: 'github', label: 'GitHub', keys: ['github'] },
    { field: 'website', label: '个人网站 / Website', keys: ['website', 'homepage', 'portfolio', 'personal-site', '个人主页', '个人网站'] },
    { field: 'scholar', label: 'Google Scholar', keys: ['scholar', 'google-scholar'] },
    { field: 'targetPosition', label: '意向职位 / Target Position', keys: ['target-position', 'desired-position', 'jobtitle', 'job-title', 'position-title', '意向职位', '应聘职位'] },
    { field: 'targetCity', label: '期望城市 / Target City', keys: ['preferred-location', 'preferred-city', 'desired-city', '期望城市', '工作地点'] },
    { field: 'expectedSalary', label: '期望薪资 / Expected Salary', keys: ['expected-salary', 'salary-expectation', 'salaryexpect', '期望薪资', '薪资要求'] },
    { field: 'availableFrom', label: '到岗时间 / Available From', keys: ['available-from', 'startdate', 'start-date', '到岗时间', '可入职时间'] },
    { field: 'skills', label: '技能 / Skills', keys: ['skills', 'skill', 'tech-stack', '技能', '技能特长'] },
    { field: 'languages', label: '语言 / Languages', keys: ['languages', 'language-skill', '语言', '语言能力'] },
    { field: 'summary', label: '自我评价 / Summary', keys: ['summary', 'self-introduction', 'about-me', 'aboutme', 'profile', '自我评价', '自我介绍', '个人简介'] }
  ];

  // ---------- Job platforms ----------
  // {q} = keyword, {city} = city
  const PLATFORMS = [
    { id: 'linkedin', name: 'LinkedIn', region: '🌐', url: 'https://www.linkedin.com/jobs/search/?keywords={q}&location={city}', selected: true },
    { id: 'indeed', name: 'Indeed', region: '🌐', url: 'https://www.indeed.com/jobs?q={q}&l={city}', selected: true },
    { id: 'glassdoor', name: 'Glassdoor', region: '🌐', url: 'https://www.glassdoor.com/Job/jobs.htm?sc.keyword={q}&locT=C&locName={city}', selected: false },
    { id: 'wellfound', name: 'Wellfound', region: '🌐', url: 'https://wellfound.com/jobs?role={q}&location={city}', selected: false },
    { id: 'hn', name: 'Hacker News Who is Hiring', region: '🌐', url: 'https://www.google.com/search?q=site%3Anews.ycombinator.com+%22who+is+hiring%22+{q}', selected: false },
    { id: 'boss', name: 'BOSS 直聘', region: '🇨🇳', url: 'https://www.zhipin.com/web/geek/job?query={q}&city={cityCN}', selected: true },
    { id: 'lagou', name: '拉勾', region: '🇨🇳', url: 'https://www.lagou.com/wn/jobs?kd={q}&city={city}', selected: true },
    { id: 'liepin', name: '猎聘', region: '🇨🇳', url: 'https://www.liepin.com/zhaopin/?key={q}&city={city}', selected: false },
    { id: 'zhilian', name: '智联招聘', region: '🇨🇳', url: 'https://sou.zhaopin.com/?kw={q}&jl={city}', selected: false },
    { id: '51job', name: '前程无忧 51job', region: '🇨🇳', url: 'https://we.51job.com/pc/search?keyword={q}&searchType=2&jobArea={city}', selected: false },
    { id: 'maimai', name: '脉脉', region: '🇨🇳', url: 'https://maimai.cn/web/search_center?type=job&query={q}', selected: false },
    { id: 'shixiseng', name: '实习僧', region: '🇨🇳', url: 'https://www.shixiseng.com/interns?keyword={q}&city={city}', selected: false }
  ];

  // BOSS uses numeric city codes — fall back to common ones; otherwise leave blank
  const BOSS_CITY_CODES = {
    '北京': '101010100', 'beijing': '101010100',
    '上海': '101020100', 'shanghai': '101020100',
    '广州': '101280100', 'guangzhou': '101280100',
    '深圳': '101280600', 'shenzhen': '101280600',
    '杭州': '101210100', 'hangzhou': '101210100',
    '成都': '101270100', 'chengdu': '101270100',
    '南京': '101190100', 'nanjing': '101190100',
    '武汉': '101200100', 'wuhan': '101200100',
    '西安': '101110100', 'xian': '101110100',
    '苏州': '101190400', 'suzhou': '101190400'
  };

  const COMPANIES = [
    { name: 'Google', url: 'https://www.google.com/about/careers/applications/jobs/results/' },
    { name: 'Meta', url: 'https://www.metacareers.com/jobs' },
    { name: 'Microsoft', url: 'https://careers.microsoft.com/v2/global/en/search' },
    { name: 'Apple', url: 'https://jobs.apple.com/en-us/search' },
    { name: 'Amazon', url: 'https://www.amazon.jobs/en/' },
    { name: 'OpenAI', url: 'https://openai.com/careers/' },
    { name: 'Anthropic', url: 'https://www.anthropic.com/careers' },
    { name: 'DeepMind', url: 'https://www.deepmind.com/careers' },
    { name: 'NVIDIA', url: 'https://www.nvidia.com/en-us/about-nvidia/careers/' },
    { name: 'ByteDance', url: 'https://jobs.bytedance.com/' },
    { name: '腾讯 Tencent', url: 'https://careers.tencent.com/' },
    { name: '阿里巴巴 Alibaba', url: 'https://talent.alibaba.com/' },
    { name: '美团 Meituan', url: 'https://zhaopin.meituan.com/' },
    { name: '百度 Baidu', url: 'https://talent.baidu.com/' },
    { name: '京东 JD', url: 'https://campus.jd.com/' },
    { name: '小米 Xiaomi', url: 'https://hr.xiaomi.com/' },
    { name: '华为 Huawei', url: 'https://career.huawei.com/' },
    { name: '商汤 SenseTime', url: 'https://www.sensetime.com/cn/join-us' },
    { name: '旷视 Megvii', url: 'https://megvii.com/careers' },
    { name: '智谱 Zhipu AI', url: 'https://zhipuai.cn/joinus' }
  ];

  // ---------- State ----------
  let state = loadResume() || createEmptyResume();
  let bookmarks = loadBookmarks();

  function createEmptyResume() {
    return {
      name: '', englishName: '', email: '', phone: '', gender: '', birthday: '',
      nationality: '', location: '', address: '',
      linkedin: '', github: '', website: '', scholar: '',
      targetPosition: '', targetCity: '', expectedSalary: '', availableFrom: '',
      skills: '', languages: '', certifications: '', summary: '',
      education: [], experience: [], projects: [],
      _rawText: ''
    };
  }

  function loadResume() {
    try {
      const raw = localStorage.getItem(JS_STORAGE_KEY);
      if (!raw) return null;
      return Object.assign(createEmptyResume(), JSON.parse(raw));
    } catch (e) { return null; }
  }

  function saveResume() {
    try {
      localStorage.setItem(JS_STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) { return false; }
  }

  function loadBookmarks() {
    try {
      const raw = localStorage.getItem(JS_BOOKMARKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveBookmarks() {
    localStorage.setItem(JS_BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }

  // ---------- DOM helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k.startsWith('on') && typeof attrs[k] === 'function') node.addEventListener(k.slice(2), attrs[k]);
        else if (attrs[k] !== false && attrs[k] != null) node.setAttribute(k, attrs[k]);
      }
    }
    for (const c of children) {
      if (c == null || c === false) continue;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  }

  // ---------- Resume text extraction (PDF -> text -> structured fields) ----------
  async function parsePdf(file) {
    if (typeof pdfjsLib === 'undefined') throw new Error('PDF.js failed to load');
    if (window.PDFJS_WORKER_SRC) pdfjsLib.GlobalWorkerOptions.workerSrc = window.PDFJS_WORKER_SRC;
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const lines = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      // Group items by y-coordinate so we get real lines instead of one long string.
      const byY = {};
      for (const item of content.items) {
        const y = Math.round(item.transform[5]);
        (byY[y] = byY[y] || []).push(item);
      }
      const ys = Object.keys(byY).map(Number).sort((a, b) => b - a);
      for (const y of ys) {
        const row = byY[y].sort((a, b) => a.transform[4] - b.transform[4]).map(i => i.str).join(' ');
        if (row.trim()) lines.push(row.trim());
      }
      updateProgress((i / pdf.numPages) * 100);
    }
    return lines.join('\n');
  }

  // Heuristic extraction. Best-effort only — user is asked to review.
  function extractFields(text) {
    const out = createEmptyResume();
    out._rawText = text;

    const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    if (emailMatch) out.email = emailMatch[0];

    // Phones: Chinese mobile, or international, or plain digits with separators
    const phoneMatch = text.match(/(?:\+?\s?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4}/);
    if (phoneMatch) {
      const cleaned = phoneMatch[0].replace(/[^\d+]/g, '');
      if (cleaned.length >= 8) out.phone = phoneMatch[0].trim();
    }

    const liMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+\/?/i);
    if (liMatch) out.linkedin = liMatch[0];
    else {
      const liShort = text.match(/linkedin\.com\/in\/[\w-]+/i);
      if (liShort) out.linkedin = 'https://' + liShort[0];
    }

    const ghMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/[\w-]+\/?/i);
    if (ghMatch) out.github = ghMatch[0];
    else {
      const ghShort = text.match(/github\.com\/[\w-]+/i);
      if (ghShort) out.github = 'https://' + ghShort[0];
    }

    const scholarMatch = text.match(/https?:\/\/scholar\.google\.com\/[^\s]+/i);
    if (scholarMatch) out.scholar = scholarMatch[0];

    const websiteMatch = text.match(/https?:\/\/[\w.-]+\.[a-z]{2,}(?:\/[^\s]*)?/gi);
    if (websiteMatch) {
      const non = websiteMatch.find(u =>
        !/linkedin|github|scholar\.google|mailto/i.test(u)
      );
      if (non) out.website = non;
    }

    // Gender
    if (/性别[\s::]*男|\bmale\b/i.test(text) && !/female/i.test(text.split(/性别|gender/i)[1] || '')) out.gender = '男';
    if (/性别[\s::]*女|\bfemale\b/i.test(text)) out.gender = '女';

    // Birthday: 1995-03-12, 1995.03.12, 1995/3/12, or 1995年3月12日
    const dobMatch = text.match(/(19\d{2}|20[0-2]\d)[\-./年](\d{1,2})[\-./月](\d{1,2})/);
    if (dobMatch) {
      out.birthday = `${dobMatch[1]}-${dobMatch[2].padStart(2, '0')}-${dobMatch[3].padStart(2, '0')}`;
    }

    // Name: first non-empty line that looks like a name (no @, no http, short)
    const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
    for (let i = 0; i < Math.min(lines.length, 8); i++) {
      const line = lines[i];
      if (line.length > 30) continue;
      if (/@|http|\d{4}|简历|resume|curriculum/i.test(line)) continue;
      // Chinese name: 2-4 chars, mostly CJK
      if (/^[一-龥]{2,4}$/.test(line)) { out.name = line; break; }
      // English name: 2-4 capitalized words
      if (/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$/.test(line)) { out.name = line; break; }
    }

    // Education / Experience / Projects: split by section keywords
    out.education = extractSection(text, [/教育(?:背景|经历)?/i, /education/i, /academic/i]);
    out.experience = extractSection(text, [/工作(?:经历|经验)/i, /实习(?:经历)?/i, /experience/i, /employment/i]);
    out.projects = extractSection(text, [/项目(?:经历|经验)?/i, /projects?\b/i]);

    // Skills section
    const skillsBlock = extractSectionRaw(text, [/技能(?:特长)?|专业技能/i, /skills/i, /technical skills/i]);
    if (skillsBlock) out.skills = skillsBlock.slice(0, 500);

    const langBlock = extractSectionRaw(text, [/语言(?:能力)?/i, /languages?\b/i]);
    if (langBlock) out.languages = langBlock.slice(0, 200);

    const sumBlock = extractSectionRaw(text, [/自我评价|个人简介|个人评价/i, /summary|profile|about\s+me/i]);
    if (sumBlock) out.summary = sumBlock.slice(0, 500);

    return out;
  }

  // Pull the chunk of text between a matching header and the next major header,
  // returning it as paragraph entries.
  function extractSection(text, patterns) {
    const raw = extractSectionRaw(text, patterns);
    if (!raw) return [];
    // Split by blank lines / clear separators
    return raw.split(/\n\s*\n|\n(?=\d{4})/).map(s => s.trim()).filter(s => s.length > 5).slice(0, 6)
      .map(s => ({ title: s.split('\n')[0].slice(0, 80), description: s }));
  }

  function extractSectionRaw(text, patterns) {
    // All possible section starts
    const allStarts = [
      /教育(?:背景|经历)?/i, /工作(?:经历|经验)/i, /实习(?:经历)?/i, /项目(?:经历|经验)?/i,
      /技能(?:特长)?|专业技能/i, /语言(?:能力)?/i, /自我评价|个人简介|个人评价/i, /证书|获奖|荣誉/i,
      /education/i, /experience/i, /employment/i, /projects?\b/i, /skills/i,
      /languages?\b/i, /summary|profile|about\s+me/i, /awards?|certifications?|honors?/i
    ];

    let startIdx = -1;
    for (const p of patterns) {
      const m = text.match(p);
      if (m && (startIdx === -1 || m.index < startIdx)) startIdx = m.index;
    }
    if (startIdx === -1) return '';

    // Find end of this header line
    const lineEnd = text.indexOf('\n', startIdx);
    if (lineEnd === -1) return '';
    let endIdx = text.length;
    for (const p of allStarts) {
      // Skip patterns that match our start
      if (patterns.some(pp => pp.source === p.source)) continue;
      const m = text.slice(lineEnd).match(p);
      if (m && lineEnd + m.index < endIdx) endIdx = lineEnd + m.index;
    }
    return text.slice(lineEnd, endIdx).trim();
  }

  // ---------- Form rendering ----------
  function renderForm() {
    // Simple fields
    $$('[data-field]').forEach(input => {
      const key = input.dataset.field;
      input.value = state[key] || '';
      input.addEventListener('input', () => { state[key] = input.value; });
    });

    renderList('education', state.education, ['title', 'school', 'degree', 'major', 'period', 'gpa', 'description'], {
      title: '学校/标题', school: '学校 / School', degree: '学历 / Degree',
      major: '专业 / Major', period: '时间 / Period', gpa: 'GPA', description: '描述 / Description'
    });
    renderList('experience', state.experience, ['title', 'company', 'position', 'period', 'location', 'description'], {
      title: '标题', company: '公司 / Company', position: '职位 / Position',
      period: '时间 / Period', location: '地点 / Location', description: '描述 / Description'
    });
    renderList('projects', state.projects, ['title', 'role', 'period', 'tech', 'description', 'url'], {
      title: '项目名 / Project', role: '角色 / Role', period: '时间 / Period',
      tech: '技术栈 / Tech', description: '描述 / Description', url: '链接 / URL'
    });

    // Add-buttons
    $$('.js-add-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.dataset.target;
        state[target] = state[target] || [];
        state[target].push({});
        renderForm();
      };
    });
  }

  function renderList(key, items, fields, labels) {
    const host = $(`#js-${key}-list`);
    if (!host) return;
    host.innerHTML = '';
    items.forEach((item, idx) => {
      const card = el('div', { class: 'js-list-item' });
      const remove = el('button', {
        type: 'button', class: 'js-remove-btn', title: '删除 / Remove',
        onclick: () => { state[key].splice(idx, 1); renderForm(); }
      }, '×');
      card.appendChild(remove);

      fields.forEach(f => {
        const field = el('div', { class: 'js-field' + (f === 'description' ? ' js-field-full' : '') });
        field.appendChild(el('label', null, labels[f] || f));
        const input = f === 'description'
          ? el('textarea', { rows: '3' })
          : el('input', { type: 'text' });
        input.value = item[f] || '';
        input.addEventListener('input', () => { item[f] = input.value; });
        field.appendChild(input);
        card.appendChild(field);
      });
      host.appendChild(card);
    });
    if (items.length === 0) {
      host.appendChild(el('div', { class: 'js-empty' }, '暂无 / None — 点击右上「+ 添加」/ Click + Add'));
    }
  }

  // ---------- Tab switching ----------
  function setupTabs() {
    $$('.js-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        $$('.js-tab').forEach(b => b.classList.toggle('active', b === btn));
        $$('.js-panel').forEach(p => p.classList.toggle('active', p.id === `js-panel-${target}`));
        if (target === 'autofill') refreshBookmarklet();
      });
    });
  }

  // ---------- Upload handling ----------
  function setupUpload() {
    const dz = $('#js-dropzone');
    const input = $('#js-file-input');
    const pick = $('#js-pick-file');

    pick.addEventListener('click', () => input.click());
    dz.addEventListener('click', e => {
      if (e.target === pick || pick.contains(e.target)) return;
      input.click();
    });
    input.addEventListener('change', () => {
      if (input.files && input.files[0]) handleFile(input.files[0]);
    });

    ['dragenter', 'dragover'].forEach(ev => {
      dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('js-dragover'); });
    });
    ['dragleave', 'drop'].forEach(ev => {
      dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('js-dragover'); });
    });
    dz.addEventListener('drop', e => {
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });
  }

  async function handleFile(file) {
    if (!/pdf/i.test(file.type) && !/\.pdf$/i.test(file.name)) {
      alert('请上传 PDF 文件 / Please upload a PDF file');
      return;
    }
    showProgress(true);
    updateProgress(5, '读取 PDF 中... / Reading PDF...');
    try {
      const text = await parsePdf(file);
      updateProgress(95, '提取字段中... / Extracting fields...');
      const extracted = extractFields(text);
      // Preserve any existing user-edited target preferences when re-importing
      const preserve = ['targetPosition', 'targetCity', 'expectedSalary', 'availableFrom'];
      preserve.forEach(k => { if (state[k]) extracted[k] = state[k]; });
      state = extracted;
      updateProgress(100, '完成 ✓ / Done');
      $('#js-step-review').style.display = '';
      $('#js-raw-text-content').textContent = text;
      renderForm();
      setTimeout(() => showProgress(false), 600);
      $('#js-step-review').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
      console.error(e);
      updateProgress(0, '解析失败 / Failed: ' + e.message);
      setTimeout(() => showProgress(false), 2000);
    }
  }

  function showProgress(visible) {
    $('#js-progress').style.display = visible ? '' : 'none';
  }
  function updateProgress(pct, text) {
    $('#js-progress-fill').style.width = pct + '%';
    if (text) $('#js-progress-text').textContent = text;
  }

  // ---------- Save / Export / Import ----------
  function setupResumeActions() {
    $('#js-save-resume').addEventListener('click', () => {
      const ok = saveResume();
      const status = $('#js-save-status');
      status.textContent = ok ? '已保存到本地浏览器 ✓ / Saved locally' : '保存失败 / Save failed';
      status.classList.toggle('js-status-ok', ok);
      setTimeout(() => { status.textContent = ''; status.classList.remove('js-status-ok'); }, 3000);
    });

    $('#js-export-resume').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = el('a', { href: url, download: `resume-${(state.name || 'data').replace(/\s+/g, '_')}.json` });
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });

    const importInput = $('#js-import-input');
    $('#js-import-resume').addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', () => {
      const f = importInput.files && importInput.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          state = Object.assign(createEmptyResume(), data);
          $('#js-step-review').style.display = '';
          renderForm();
          alert('导入成功 / Imported');
        } catch (e) { alert('JSON 解析失败 / Invalid JSON: ' + e.message); }
      };
      reader.readAsText(f);
    });

    $('#js-clear-resume').addEventListener('click', () => {
      if (!confirm('确定清除所有已保存的简历信息？此操作不可恢复。\nClear all saved resume data? This cannot be undone.')) return;
      localStorage.removeItem(JS_STORAGE_KEY);
      state = createEmptyResume();
      $('#js-step-review').style.display = 'none';
      renderForm();
    });
  }

  // ---------- Job search platforms ----------
  function setupSearch() {
    const grid = $('#js-platform-grid');
    PLATFORMS.forEach(p => {
      const id = `js-plat-${p.id}`;
      const wrapper = el('label', { class: 'js-platform' },
        el('input', { type: 'checkbox', id, 'data-pid': p.id, checked: p.selected ? 'checked' : false }),
        el('span', { class: 'js-platform-region' }, p.region),
        el('span', { class: 'js-platform-name' }, p.name)
      );
      grid.appendChild(wrapper);
    });

    $('#js-search-go').addEventListener('click', () => doSearch(false));
    $('#js-search-all').addEventListener('click', () => doSearch(true));
    $('#js-search-select-all').addEventListener('click', () => $$('#js-platform-grid input').forEach(c => c.checked = true));
    $('#js-search-deselect').addEventListener('click', () => $$('#js-platform-grid input').forEach(c => c.checked = false));

    // Pre-fill search keyword from saved target position
    if (state.targetPosition) $('#js-search-keyword').value = state.targetPosition;
    if (state.targetCity) $('#js-search-city').value = state.targetCity;

    $('#js-custom-url-go').addEventListener('click', openCustomUrl);
    $('#js-custom-url').addEventListener('keydown', e => { if (e.key === 'Enter') openCustomUrl(); });
    $('#js-custom-url-save').addEventListener('click', saveBookmarkClick);

    renderBookmarks();
    renderCompanies();
  }

  function doSearch(forceAll) {
    const q = $('#js-search-keyword').value.trim();
    const city = $('#js-search-city').value.trim();
    if (!q) { alert('请输入关键词 / Please enter a keyword'); return; }
    const selected = forceAll ? PLATFORMS : PLATFORMS.filter(p => {
      const cb = $(`#js-plat-${p.id}`);
      return cb && cb.checked;
    });
    if (selected.length === 0) { alert('请至少选择一个平台 / Pick at least one platform'); return; }
    if (selected.length > 4 && !confirm(`将打开 ${selected.length} 个新标签页，确认？\nOpen ${selected.length} new tabs?`)) return;

    selected.forEach(p => {
      const url = buildUrl(p, q, city);
      window.open(url, '_blank', 'noopener');
    });
  }

  function buildUrl(platform, q, city) {
    const cityCN = BOSS_CITY_CODES[city.toLowerCase()] || BOSS_CITY_CODES[city] || '100010000';
    return platform.url
      .replace('{q}', encodeURIComponent(q))
      .replace('{city}', encodeURIComponent(city))
      .replace('{cityCN}', cityCN);
  }

  function openCustomUrl() {
    const url = $('#js-custom-url').value.trim();
    if (!url) return;
    const full = /^https?:\/\//.test(url) ? url : 'https://' + url;
    window.open(full, '_blank', 'noopener');
  }

  function saveBookmarkClick() {
    const url = $('#js-custom-url').value.trim();
    if (!url) return;
    const full = /^https?:\/\//.test(url) ? url : 'https://' + url;
    const label = prompt('给这个链接起个名字 / Name this link:', new URL(full).hostname);
    if (label === null) return;
    bookmarks.push({ url: full, label: label || full, at: Date.now() });
    saveBookmarks();
    renderBookmarks();
  }

  function renderBookmarks() {
    const ul = $('#js-bookmarks-list');
    ul.innerHTML = '';
    if (bookmarks.length === 0) {
      ul.appendChild(el('li', { class: 'js-empty' }, '暂无收藏 / No saved links yet'));
      return;
    }
    bookmarks.slice().reverse().forEach((b) => {
      const realIdx = bookmarks.indexOf(b);
      const li = el('li', { class: 'js-bookmark' },
        el('a', { href: b.url, target: '_blank', rel: 'noopener' }, b.label),
        el('span', { class: 'js-bookmark-url' }, b.url),
        el('button', {
          type: 'button', class: 'js-remove-btn', title: '删除 / Remove',
          onclick: () => { bookmarks.splice(realIdx, 1); saveBookmarks(); renderBookmarks(); }
        }, '×')
      );
      ul.appendChild(li);
    });
  }

  function renderCompanies() {
    const host = $('#js-companies-grid');
    COMPANIES.forEach(c => {
      host.appendChild(el('a', { href: c.url, target: '_blank', rel: 'noopener', class: 'js-company' }, c.name));
    });
  }

  // ---------- Bookmarklet generator + quick copy + rules table ----------
  function setupAutofill() {
    refreshBookmarklet();
    renderRulesTable();
    renderQuickCopy();
  }

  function refreshBookmarklet() {
    const status = $('#js-bookmarklet-status');
    const link = $('#js-bookmarklet-link');
    const hasData = state.name || state.email || state.phone;
    if (!hasData) {
      status.textContent = '请先在「简历信息」中填写并保存简历 / Please save your resume info first';
      link.style.display = 'none';
      return;
    }
    status.textContent = `已为「${state.name || state.email}」生成自动填表书签 ✓ / Bookmarklet ready`;
    link.style.display = '';
    link.href = generateBookmarklet();
    renderQuickCopy();
  }

  function generateBookmarklet() {
    // Build a compact JSON payload + the runtime that consumes it.
    const payload = {
      data: {
        name: state.name, englishName: state.englishName, email: state.email, phone: state.phone,
        gender: state.gender, birthday: state.birthday, nationality: state.nationality,
        location: state.location, address: state.address,
        linkedin: state.linkedin, github: state.github, website: state.website, scholar: state.scholar,
        targetPosition: state.targetPosition, targetCity: state.targetCity,
        expectedSalary: state.expectedSalary, availableFrom: state.availableFrom,
        skills: state.skills, languages: state.languages, summary: state.summary
      },
      rules: FIELD_RULES
    };

    // The bookmarklet runtime (kept compact intentionally — runs as a single javascript: URL).
    const runtime = function () {
      try {
        var P = window.__JS_PAYLOAD__;
        if (!P) { alert('Bookmarklet payload missing'); return; }
        var data = P.data, rules = P.rules;

        function getLabelText(input) {
          var t = '';
          if (input.id) {
            var lab = document.querySelector('label[for="' + CSS.escape(input.id) + '"]');
            if (lab) t += ' ' + lab.textContent;
          }
          var parent = input.closest('label');
          if (parent) t += ' ' + parent.textContent;
          // ARIA labelled by
          var lb = input.getAttribute('aria-labelledby');
          if (lb) {
            lb.split(/\s+/).forEach(function (id) {
              var n = document.getElementById(id);
              if (n) t += ' ' + n.textContent;
            });
          }
          // Walk up to look for a nearby field group label
          var p = input.parentElement, hops = 0;
          while (p && hops < 4) {
            var lab2 = p.querySelector ? p.querySelector('label, .label, .ant-form-item-label, [class*="label"]') : null;
            if (lab2 && !lab2.contains(input)) { t += ' ' + lab2.textContent; break; }
            p = p.parentElement; hops++;
          }
          return t;
        }

        function describe(input) {
          var parts = [
            input.name, input.id, input.placeholder,
            input.getAttribute('aria-label'),
            input.getAttribute('data-field'),
            input.getAttribute('data-name'),
            getLabelText(input)
          ].filter(Boolean).join(' ');
          return parts.toLowerCase();
        }

        function setValue(input, val) {
          var proto = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
          var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
          setter.call(input, val);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('blur', { bubbles: true }));
        }

        function pickGender(input, val) {
          // Radios / selects with male/female options
          if (input.tagName === 'SELECT') {
            var match = Array.from(input.options).find(function (o) {
              var t = (o.value + ' ' + o.textContent).toLowerCase();
              if (val === '男' || /male/i.test(val)) return /男|^m$|male/.test(t) && !/female/.test(t);
              if (val === '女' || /female/i.test(val)) return /女|^f$|female/.test(t);
              return false;
            });
            if (match) { input.value = match.value; input.dispatchEvent(new Event('change', { bubbles: true })); return true; }
          }
          if (input.type === 'radio') {
            var label = describe(input);
            if ((val === '男' || /male/i.test(val)) && /男|male/.test(label) && !/female/.test(label)) {
              input.click(); return true;
            }
            if ((val === '女' || /female/i.test(val)) && /女|female/.test(label)) {
              input.click(); return true;
            }
          }
          return false;
        }

        var filled = 0, skipped = [];
        var inputs = document.querySelectorAll('input, textarea, select');
        var seenFields = {};

        for (var i = 0; i < inputs.length; i++) {
          var inp = inputs[i];
          if (inp.disabled || inp.readOnly) continue;
          if (inp.type === 'hidden' || inp.type === 'submit' || inp.type === 'button' || inp.type === 'file' || inp.type === 'password') continue;
          if (inp.type === 'checkbox') continue;

          var desc = describe(inp);
          if (!desc) continue;

          var matched = null;
          for (var r = 0; r < rules.length; r++) {
            var rule = rules[r];
            var val = data[rule.field];
            if (!val) continue;
            // require keyword boundary so 'name' doesn't match 'company'
            for (var k = 0; k < rule.keys.length; k++) {
              var key = rule.keys[k];
              var re = new RegExp('(^|[^a-z0-9\\u4e00-\\u9fa5])' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9\\u4e00-\\u9fa5]|$)', 'i');
              if (re.test(desc)) { matched = rule; break; }
            }
            if (matched) break;
          }
          if (!matched) continue;

          // Prefer first match per field unless inputs are clearly different (e.g. confirm-email)
          if (seenFields[matched.field] && !/confirm|verify|again/i.test(desc)) continue;
          seenFields[matched.field] = true;

          var value = data[matched.field];
          if (matched.field === 'gender' && pickGender(inp, value)) { filled++; continue; }
          if (inp.tagName === 'SELECT') {
            var opt = Array.from(inp.options).find(function (o) {
              return o.value === value || o.textContent.trim() === value;
            });
            if (opt) { inp.value = opt.value; inp.dispatchEvent(new Event('change', { bubbles: true })); filled++; continue; }
          }
          if (matched.field === 'birthday' && inp.type === 'date') {
            // value is already YYYY-MM-DD
            setValue(inp, value); filled++; continue;
          }
          setValue(inp, value);
          filled++;
        }

        var msg = '✓ 已自动填充 ' + filled + ' 个字段 / Filled ' + filled + ' fields';
        if (filled === 0) msg = '未能识别可填字段 — 试试网站的中文字段名或手动复制 / No fields matched';
        // Floating toast — avoids alert() blocking single-page-app navigation
        var toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;top:20px;right:20px;z-index:2147483647;background:#1e293b;color:#fff;padding:12px 18px;border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,0.3);font:14px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:320px';
        document.body.appendChild(toast);
        setTimeout(function () { toast.style.transition = 'opacity .4s'; toast.style.opacity = '0'; }, 3000);
        setTimeout(function () { toast.remove(); }, 3500);
      } catch (err) {
        alert('Autofill error: ' + err.message);
      }
    };

    // URL-encode the JSON payload so characters like # or % don't break the
    // javascript: URL (the URL parser would otherwise treat # as a fragment).
    const encoded = encodeURIComponent(JSON.stringify(payload));
    const js =
      'javascript:(function(){' +
      'window.__JS_PAYLOAD__=JSON.parse(decodeURIComponent("' + encoded + '"));' +
      '(' + runtime.toString() + ')();' +
      '})();void(0);';
    return js;
  }

  function renderRulesTable() {
    const host = $('#js-rules-table');
    if (!host) return;
    host.innerHTML = '';
    const table = el('table', { class: 'js-rules-table' });
    const thead = el('thead', null, el('tr', null,
      el('th', null, '字段 / Field'),
      el('th', null, '匹配关键词 / Keywords')
    ));
    const tbody = el('tbody');
    FIELD_RULES.forEach(r => {
      tbody.appendChild(el('tr', null,
        el('td', null, r.label),
        el('td', null, r.keys.join(', '))
      ));
    });
    table.appendChild(thead); table.appendChild(tbody);
    host.appendChild(table);
  }

  function renderQuickCopy() {
    const host = $('#js-quick-copy');
    if (!host) return;
    host.innerHTML = '';
    FIELD_RULES.forEach(r => {
      const val = state[r.field];
      if (!val) return;
      const item = el('div', { class: 'js-copy-item' },
        el('div', { class: 'js-copy-label' }, r.label),
        el('div', { class: 'js-copy-value' }, val.length > 80 ? val.slice(0, 80) + '…' : val),
        el('button', {
          type: 'button', class: 'js-btn js-btn-small',
          onclick: async (e) => {
            try {
              await navigator.clipboard.writeText(val);
              e.target.textContent = '✓ 已复制 / Copied';
              setTimeout(() => { e.target.textContent = '📋 复制 / Copy'; }, 1500);
            } catch (err) {
              alert('复制失败 / Copy failed');
            }
          }
        }, '📋 复制 / Copy')
      );
      host.appendChild(item);
    });
    if (host.children.length === 0) {
      host.appendChild(el('div', { class: 'js-empty' }, '请先在「简历信息」中填写并保存简历 / Fill in resume first'));
    }
  }

  // ---------- Init ----------
  function init() {
    setupTabs();
    setupUpload();
    setupResumeActions();
    setupSearch();
    setupAutofill();

    // If saved data exists, show review section right away
    if (state.name || state.email || state.phone || (state._rawText && state._rawText.length)) {
      $('#js-step-review').style.display = '';
      if (state._rawText) $('#js-raw-text-content').textContent = state._rawText;
      renderForm();
    } else {
      renderForm();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
