/* Paper Notes Manager - Phase 1 (LocalStorage)
 * Stores per-paper notes in LocalStorage.
 * Exposes window.PaperNotes.
 */
(function () {
  'use strict';

  const STORAGE_PREFIX = 'paperNotes:';

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
    return '';
  }

  function renderStars(rating) {
    const r = Number(rating);
    if (!r || r < 1) return '';
    return '★'.repeat(r) + '☆'.repeat(Math.max(0, 5 - r));
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

  function openModal(paperId) {
    const modal = $('paper-notes-modal');
    if (!modal) return;

    const meta = getPaperMetaFromCard(paperId);

    $('paper-notes-paper-id').value = paperId;
    $('paper-notes-subtitle').textContent = [meta.venue, meta.year].filter(Boolean).join(' · ');
    $('paper-notes-title').textContent = `📝 Notes: ${meta.title || paperId}`;

    const note = load(paperId) || { status: 'to-read', rating: '', text: '' };
    $('paper-notes-status').value = note.status || 'to-read';
    $('paper-notes-rating').value = note.rating ?? '';
    $('paper-notes-text').value = note.text || '';

    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = $('paper-notes-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function bindModalEvents() {
    const modal = $('paper-notes-modal');
    if (!modal) return;

    modal.addEventListener('click', (e) => {
      if (e.target && e.target.matches('[data-notes-close]')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
    });

    $('paper-notes-save')?.addEventListener('click', () => {
      const paperId = $('paper-notes-paper-id').value;
      if (!paperId) return;

      const payload = {
        status: $('paper-notes-status').value,
        rating: $('paper-notes-rating').value,
        text: $('paper-notes-text').value,
        updatedAt: new Date().toISOString()
      };

      save(paperId, payload);
      updateCardBadges(paperId);
      closeModal();
    });

    $('paper-notes-delete')?.addEventListener('click', () => {
      const paperId = $('paper-notes-paper-id').value;
      if (!paperId) return;
      remove(paperId);
      updateCardBadges(paperId);
      closeModal();
    });
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
