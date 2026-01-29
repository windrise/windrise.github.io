/* Paper Notes Manager - Phase 2 (LocalStorage + Markdown editor + autosave)
 * Stores per-paper notes in LocalStorage.
 * Exposes window.PaperNotes.
 */
(function () {
  'use strict';

  const STORAGE_PREFIX = 'paperNotes:';
  const AUTOSAVE_MS = 5000;

  let currentPaperId = null;
  let autosaveTimer = null;
  let lastSavedAt = null;
  let easyMDE = null;
  let editorReady = false;

  function $(id) {
    return document.getElementById(id);
  }

  function safeJSONParse(str) {
    try { return JSON.parse(str); } catch { return null; }
  }

  function keyFor(paperId) {
    return `${STORAGE_PREFIX}${paperId}`;
  }

  function getPaperMetaFromCard(paperId) {
    const card = document.querySelector(`.paper-card[data-paper-id="${CSS.escape(paperId)}"]`);
    if (!card) return { title: '', venue: '', year: '' };

    const data = safeJSONParse(card.dataset.paperData || '') || {};
    return {
      title: data.title || card.querySelector('.paper-title')?.textContent?.trim() || '',
      venue: data.venue || '',
      year: data.year || card.dataset.year || ''
    };
  }

  function load(paperId) {
    const raw = localStorage.getItem(keyFor(paperId));
    return raw ? safeJSONParse(raw) : null;
  }

  function save(paperId, payload) {
    localStorage.setItem(keyFor(paperId), JSON.stringify(payload));
  }

  function remove(paperId) {
    localStorage.removeItem(keyFor(paperId));
  }

  function statusLabel(status) {
    if (status === 'to-read') return '📌 To read';
    if (status === 'reading') return '📖 Reading';
    if (status === 'completed') return '✅ Done';
    if (status === 'skipped') return '⏭️ Skipped';
    return '';
  }

  function renderStars(rating) {
    const r = Number(rating);
    if (!r || r < 1) return '';
    return '★'.repeat(r) + '☆'.repeat(Math.max(0, 5 - r));
  }

  function updateAutosaveLabel(text) {
    const el = $('paper-notes-autosave');
    if (!el) return;
    el.textContent = text;
  }

  function updateProgressLabel() {
    const val = Number($('paper-notes-progress')?.value || 0);
    const out = $('paper-notes-progress-label');
    if (out) out.textContent = `${val}%`;
  }

  function normalizeTags(str) {
    return (str || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  function denormalizeTags(arr) {
    return Array.isArray(arr) ? arr.join(', ') : '';
  }

  function getNotesMarkdown() {
    // Prefer editor content if initialized
    if (easyMDE) return easyMDE.value() || '';
    return $('paper-notes-text')?.value || '';
  }

  function setNotesMarkdown(md) {
    if (easyMDE) {
      easyMDE.value(md || '');
      return;
    }
    const ta = $('paper-notes-text');
    if (ta) ta.value = md || '';
  }

  function collectPayload() {
    const payload = {
      status: $('paper-notes-status')?.value || 'to-read',
      priority: $('paper-notes-priority')?.value || '',
      progress: Number($('paper-notes-progress')?.value || 0),
      rating: $('paper-notes-rating')?.value ?? '',
      tags: normalizeTags($('paper-notes-tags')?.value || ''),
      notes: getNotesMarkdown(),
      my_summary: $('paper-notes-my-summary')?.value || '',
      todos_md: $('paper-notes-todos')?.value || '',
      highlights_md: $('paper-notes-highlights')?.value || '',
      updatedAt: new Date().toISOString()
    };

    // Preserve createdAt if exists
    const existing = currentPaperId ? load(currentPaperId) : null;
    payload.createdAt = existing?.createdAt || payload.updatedAt;

    return payload;
  }

  function applyPayload(note) {
    const n = note || { status: 'to-read', priority: '', progress: 0, rating: '', tags: [], notes: '' };
    $('paper-notes-status').value = n.status || 'to-read';
    $('paper-notes-priority').value = n.priority ?? '';
    $('paper-notes-progress').value = String(n.progress ?? 0);
    updateProgressLabel();
    $('paper-notes-rating').value = n.rating ?? '';
    $('paper-notes-tags').value = denormalizeTags(n.tags);
    setNotesMarkdown(n.notes || '');
    $('paper-notes-my-summary').value = n.my_summary || '';
    $('paper-notes-todos').value = n.todos_md || '';
    $('paper-notes-highlights').value = n.highlights_md || '';
  }

  function updateCardBadges(paperId) {
    const card = document.querySelector(`.paper-card[data-paper-id="${CSS.escape(paperId)}"]`);
    if (!card) return;

    const badge = card.querySelector(`[data-notes-badge="${CSS.escape(paperId)}"]`);
    const ratingEl = card.querySelector(`[data-notes-rating="${CSS.escape(paperId)}"]`);

    const note = load(paperId);

    if (badge) {
      if (note && note.status) {
        badge.textContent = statusLabel(note.status);
        badge.style.display = '';
      } else {
        badge.textContent = '';
        badge.style.display = 'none';
      }
    }

    if (ratingEl) {
      const stars = note?.rating ? renderStars(note.rating) : '';
      if (stars) {
        ratingEl.textContent = stars;
        ratingEl.style.display = '';
      } else {
        ratingEl.textContent = '';
        ratingEl.style.display = 'none';
      }
    }
  }

  function updateAllBadges() {
    document.querySelectorAll('.paper-card[data-paper-id]').forEach(card => {
      const id = card.dataset.paperId;
      if (id) updateCardBadges(id);
    });
  }

  function ensureEditor() {
    if (editorReady) return;
    editorReady = true;

    // Wait for EasyMDE to be available; if not, keep textarea.
    if (!window.EasyMDE) return;

    const textarea = $('paper-notes-text');
    if (!textarea) return;

    easyMDE = new window.EasyMDE({
      element: textarea,
      autofocus: false,
      spellChecker: false,
      status: false,
      autoDownloadFontAwesome: false,
      minHeight: '260px',
      placeholder: textarea.getAttribute('placeholder') || ''
    });
  }

  function startAutosave() {
    stopAutosave();
    updateAutosaveLabel('Autosave: on');

    autosaveTimer = window.setInterval(() => {
      if (!currentPaperId) return;
      const payload = collectPayload();
      save(currentPaperId, payload);
      updateCardBadges(currentPaperId);
      lastSavedAt = Date.now();
      updateAutosaveLabel('Autosave: saved just now');
    }, AUTOSAVE_MS);
  }

  function stopAutosave() {
    if (autosaveTimer) {
      window.clearInterval(autosaveTimer);
      autosaveTimer = null;
    }
  }

  function openModal(paperId) {
    const modal = $('paper-notes-modal');
    if (!modal) return;

    currentPaperId = paperId;

    const meta = getPaperMetaFromCard(paperId);
    $('paper-notes-paper-id').value = paperId;
    $('paper-notes-subtitle').textContent = [meta.venue, meta.year].filter(Boolean).join(' · ');
    $('paper-notes-title').textContent = `📝 Notes: ${meta.title || paperId}`;

    // Editor init (if lib loaded)
    ensureEditor();

    const note = load(paperId) || { status: 'to-read', priority: '', progress: 0, rating: '', tags: [], notes: '' };
    applyPayload(note);

    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    startAutosave();
  }

  function closeModal() {
    const modal = $('paper-notes-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    stopAutosave();
    currentPaperId = null;
    updateAutosaveLabel('Autosave: —');
  }

  function exportMarkdown(paperId) {
    const meta = getPaperMetaFromCard(paperId);
    const note = load(paperId) || collectPayload();

    const front = [
      `# ${meta.title || paperId}`,
      '',
      `- Status: ${note.status || ''}`,
      `- Priority: ${note.priority || ''}`,
      `- Progress: ${note.progress ?? 0}%`,
      `- Rating: ${note.rating || ''}`,
      note.tags?.length ? `- Tags: ${note.tags.join(', ')}` : '',
      ''
    ].filter(Boolean).join('\n');

    const body = [
      '## Notes',
      note.notes || '',
      '',
      '## My Summary',
      note.my_summary || '',
      '',
      '## To-do',
      note.todos_md || '',
      '',
      '## Highlights',
      note.highlights_md || ''
    ].join('\n');

    const md = `${front}\n${body}`.trim() + '\n';

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${paperId}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function bindTabs() {
    const tabs = Array.from(document.querySelectorAll('.paper-notes-tab'));
    const panes = Array.from(document.querySelectorAll('.paper-notes-pane'));
    if (!tabs.length || !panes.length) return;

    function activate(name) {
      tabs.forEach(t => t.classList.toggle('is-active', t.getAttribute('data-notes-tab') === name));
      panes.forEach(p => {
        const on = p.getAttribute('data-notes-pane') === name;
        p.style.display = on ? '' : 'none';
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const name = tab.getAttribute('data-notes-tab');
        activate(name);
        // Refresh editor layout after showing
        if (easyMDE && name === 'notes') {
          setTimeout(() => easyMDE.codemirror.refresh(), 0);
        }
      });
    });
  }

  function bindModalEvents() {
    const modal = $('paper-notes-modal');
    if (!modal) return;

    // Close handlers
    modal.addEventListener('click', (e) => {
      if (e.target && e.target.matches('[data-notes-close]')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
    });

    // Progress live label
    $('paper-notes-progress')?.addEventListener('input', updateProgressLabel);

    // Save
    $('paper-notes-save')?.addEventListener('click', () => {
      const paperId = $('paper-notes-paper-id').value;
      if (!paperId) return;

      const payload = collectPayload();
      save(paperId, payload);
      updateCardBadges(paperId);
      lastSavedAt = Date.now();
      updateAutosaveLabel('Autosave: saved');
      closeModal();
    });

    // Delete
    $('paper-notes-delete')?.addEventListener('click', () => {
      const paperId = $('paper-notes-paper-id').value;
      if (!paperId) return;
      remove(paperId);
      updateCardBadges(paperId);
      closeModal();
    });

    // Export
    $('paper-notes-export')?.addEventListener('click', () => {
      const paperId = $('paper-notes-paper-id').value;
      if (!paperId) return;
      // Ensure latest state is saved before exporting
      save(paperId, collectPayload());
      exportMarkdown(paperId);
    });

    bindTabs();
  }

  function bindCardButtons() {
    // Event delegation for dynamically-filtered cards
    document.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('.paper-notes-btn');
      if (!btn) return;
      const paperId = btn.getAttribute('data-paper-id');
      if (!paperId) return;
      openModal(paperId);
    });
  }

  window.PaperNotes = {
    init() {
      bindModalEvents();
      bindCardButtons();
      updateAllBadges();
    },
    open: openModal,
    close: closeModal,
    load,
    save,
    remove
  };
})();
