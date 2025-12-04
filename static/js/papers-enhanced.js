(function() {
  'use strict';

  const app = {
    papers: null,
    allPapersData: [],
    selectedPapers: new Set(),
    selectionMode: false,
    filters: {
      search: '',
      years: new Set(),
      categories: new Set(),
      quick: new Set(),
      allYears: true,
      allCategories: true
    },
    sortBy: 'date-desc',

    init() {
      this.papers = document.querySelectorAll('.paper-card');
      this.collectPapersData();
      this.bindEvents();
      this.loadSelectionFromURL();
      this.updateResults();
    },

    collectPapersData() {
      this.papers.forEach(paper => {
        try {
          const dataStr = paper.dataset.paperData;
          if (dataStr) {
            const data = JSON.parse(dataStr);
            data.id = paper.dataset.paperId;
            this.allPapersData.push(data);
          }
        } catch (e) {
          console.error('Failed to parse paper data:', e);
        }
      });
    },

    bindEvents() {
      // Helper function to safely add event listener
      const safeAddListener = (id, event, handler) => {
        const element = document.getElementById(id);
        if (element) {
          element.addEventListener(event, handler);
        }
      };

      // Search
      const searchInput = document.getElementById('search-input');
      const clearSearch = document.getElementById('clear-search');

      if (searchInput && clearSearch) {
        searchInput.addEventListener('input', (e) => {
          this.filters.search = e.target.value.toLowerCase();
          clearSearch.style.display = e.target.value ? 'block' : 'none';
          this.updateResults();
        });

        clearSearch.addEventListener('click', () => {
          searchInput.value = '';
          this.filters.search = '';
          clearSearch.style.display = 'none';
          this.updateResults();
        });
      }

      // Year filters
      safeAddListener('year-filters', 'click', (e) => {
        if (e.target.classList.contains('filter-tag')) {
          this.handleYearFilter(e.target);
        }
      });

      // Category filters
      safeAddListener('category-filters', 'click', (e) => {
        if (e.target.classList.contains('filter-tag')) {
          this.handleCategoryFilter(e.target);
        }
      });

      // Quick filters
      safeAddListener('quick-filters', 'click', (e) => {
        if (e.target.classList.contains('filter-tag')) {
          this.handleQuickFilter(e.target);
        }
      });

      // Sort
      safeAddListener('sort-select', 'change', (e) => {
        this.sortBy = e.target.value;
        this.updateResults();
      });

      // Reset
      safeAddListener('reset-filters', 'click', () => {
        this.resetFilters();
      });

      safeAddListener('clear-all-btn', 'click', () => {
        this.resetFilters();
      });

      // Abstract toggle
      document.querySelectorAll('.toggle-abstract-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const expanded = btn.dataset.expanded === 'true';
          const fullAbstract = btn.nextElementSibling;
          const showText = btn.querySelector('.show-text');
          const hideText = btn.querySelector('.hide-text');

          if (fullAbstract && showText && hideText) {
            if (expanded) {
              fullAbstract.style.display = 'none';
              showText.style.display = 'inline';
              hideText.style.display = 'none';
              btn.dataset.expanded = 'false';
            } else {
              fullAbstract.style.display = 'block';
              showText.style.display = 'none';
              hideText.style.display = 'inline';
              btn.dataset.expanded = 'true';
            }
          }
        });
      });

      // Selection mode toggle
      safeAddListener('toggle-selection-mode', 'click', () => {
        this.toggleSelectionMode();
      });

      // Paper selection
      document.querySelectorAll('.paper-select-cb').forEach(cb => {
        cb.addEventListener('change', (e) => {
          const card = e.target.closest('.paper-card');
          if (card) {
            const paperId = card.dataset.paperId;
            if (e.target.checked) {
              this.selectedPapers.add(paperId);
            } else {
              this.selectedPapers.delete(paperId);
            }
            this.updateSelectionUI();
          }
        });
      });

      // Selection actions
      safeAddListener('share-btn', 'click', () => this.shareSelection());
      safeAddListener('export-bibtex-btn', 'click', () => this.exportBibTeX());
      safeAddListener('export-json-btn', 'click', () => this.exportJSON());
      safeAddListener('export-markdown-btn', 'click', () => this.exportMarkdown());
      safeAddListener('clear-selection-btn', 'click', () => this.clearSelection());

      // Select all visible
      safeAddListener('select-all-visible', 'click', () => {
        this.selectAllVisible();
      });

      // Share modal
      safeAddListener('close-share-modal', 'click', () => {
        const modal = document.getElementById('share-modal');
        if (modal) modal.style.display = 'none';
      });

      safeAddListener('copy-share-link', 'click', () => {
        this.copyShareLink();
      });

      // Close modal on outside click
      const shareModal = document.getElementById('share-modal');
      if (shareModal) {
        shareModal.addEventListener('click', (e) => {
          if (e.target.id === 'share-modal') {
            shareModal.style.display = 'none';
          }
        });
      }

      // Back to top
      const backToTop = document.getElementById('back-to-top');
      if (backToTop) {
        window.addEventListener('scroll', () => {
          if (window.scrollY > 300) {
            backToTop.classList.add('show');
          } else {
            backToTop.classList.remove('show');
          }
        });

        backToTop.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    },

    toggleSelectionMode() {
      this.selectionMode = !this.selectionMode;
      const btn = document.getElementById('toggle-selection-mode');
      const container = document.getElementById('papers-app');
      const selectAllBtn = document.getElementById('select-all-visible');

      if (!btn || !container) return;

      if (this.selectionMode) {
        btn.classList.add('active');
        btn.innerHTML = '<span class="toggle-icon">✕</span> Exit Selection';
        container.classList.add('selection-mode');
        if (selectAllBtn) selectAllBtn.style.display = 'flex';

        // Show checkboxes
        document.querySelectorAll('.paper-checkbox').forEach(cb => {
          cb.style.display = 'block';
        });
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<span class="toggle-icon">☑️</span> Selection Mode';
        container.classList.remove('selection-mode');
        if (selectAllBtn) selectAllBtn.style.display = 'none';

        // Hide checkboxes
        document.querySelectorAll('.paper-checkbox').forEach(cb => {
          cb.style.display = 'none';
        });

        this.clearSelection();
      }
    },

    selectAllVisible() {
      const visiblePapers = Array.from(this.papers).filter(p => !p.classList.contains('hidden'));
      visiblePapers.forEach(paper => {
        const paperId = paper.dataset.paperId;
        this.selectedPapers.add(paperId);
        const cb = paper.querySelector('.paper-select-cb');
        if (cb) cb.checked = true;
      });
      this.updateSelectionUI();
    },

    clearSelection() {
      this.selectedPapers.clear();
      document.querySelectorAll('.paper-select-cb').forEach(cb => {
        cb.checked = false;
      });
      document.querySelectorAll('.paper-card').forEach(card => {
        card.classList.remove('selected');
      });
      this.updateSelectionUI();
    },

    updateSelectionUI() {
      const count = this.selectedPapers.size;
      const selectionBar = document.getElementById('selection-bar');
      const countSpan = document.getElementById('selection-count');

      if (selectionBar) {
        if (count > 0) {
          selectionBar.style.display = 'block';
          if (countSpan) {
            countSpan.textContent = `${count} paper${count !== 1 ? 's' : ''} selected`;
          }
        } else {
          selectionBar.style.display = 'none';
        }
      }

      // Update card styling
      this.papers.forEach(paper => {
        const paperId = paper.dataset.paperId;
        if (this.selectedPapers.has(paperId)) {
          paper.classList.add('selected');
        } else {
          paper.classList.remove('selected');
        }
      });
    },

    shareSelection() {
      if (this.selectedPapers.size === 0) {
        alert('Please select at least one paper');
        return;
      }

      const ids = Array.from(this.selectedPapers).join(',');
      const baseUrl = window.location.href.split('#')[0].split('?')[0];
      const shareUrl = `${baseUrl}#selected=${ids}`;

      const shareLinkInput = document.getElementById('share-link-input');
      const shareModal = document.getElementById('share-modal');

      if (shareLinkInput) shareLinkInput.value = shareUrl;
      if (shareModal) shareModal.style.display = 'flex';
    },

    copyShareLink() {
      const input = document.getElementById('share-link-input');
      if (!input) return;

      input.select();
      document.execCommand('copy');

      const btn = document.getElementById('copy-share-link');
      if (btn) {
        btn.classList.add('copied');
        btn.textContent = '✓ Copied!';

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '📋 Copy';
        }, 2000);
      }
    },

    loadSelectionFromURL() {
      const hash = window.location.hash;
      if (hash.startsWith('#selected=')) {
        const ids = hash.substring(10).split(',');
        ids.forEach(id => this.selectedPapers.add(id));

        if (this.selectedPapers.size > 0 && !this.selectionMode) {
          this.toggleSelectionMode();
        }

        this.updateSelectionUI();
      }
    },

    exportBibTeX() {
      if (this.selectedPapers.size === 0) {
        alert('Please select at least one paper');
        return;
      }

      let bibtex = '';
      this.selectedPapers.forEach(paperId => {
        const paperData = this.allPapersData.find(p => p.id === paperId);
        if (paperData) {
          const key = `${paperData.authors[0]?.split(' ').pop() || 'Unknown'}${paperData.year}`;
          bibtex += `@article{${key},\n`;
          bibtex += `  title={${paperData.title}},\n`;
          bibtex += `  author={${paperData.authors.join(' and ')}},\n`;
          bibtex += `  year={${paperData.year}},\n`;
          if (paperData.venue) bibtex += `  journal={${paperData.venue}},\n`;
          if (paperData.arxiv_id) bibtex += `  eprint={${paperData.arxiv_id}},\n`;
          if (paperData.links?.paper) bibtex += `  url={${paperData.links.paper}},\n`;
          bibtex += `}\n\n`;
        }
      });

      this.downloadFile(bibtex, 'papers.bib', 'text/plain');
    },

    exportJSON() {
      if (this.selectedPapers.size === 0) {
        alert('Please select at least one paper');
        return;
      }

      const selectedData = this.allPapersData.filter(p => this.selectedPapers.has(p.id));
      const json = JSON.stringify(selectedData, null, 2);
      this.downloadFile(json, 'papers.json', 'application/json');
    },

    exportMarkdown() {
      if (this.selectedPapers.size === 0) {
        alert('Please select at least one paper');
        return;
      }

      let markdown = '# Selected Papers\n\n';
      this.selectedPapers.forEach(paperId => {
        const paperData = this.allPapersData.find(p => p.id === paperId);
        if (paperData) {
          markdown += `## ${paperData.title}\n\n`;
          markdown += `**Authors:** ${paperData.authors.join(', ')}\n\n`;
          markdown += `**Year:** ${paperData.year}\n\n`;
          if (paperData.venue) markdown += `**Venue:** ${paperData.venue}\n\n`;
          if (paperData.abstract) markdown += `**Abstract:** ${paperData.abstract}\n\n`;
          if (paperData.links?.paper) markdown += `**Paper:** [${paperData.links.paper}](${paperData.links.paper})\n\n`;
          if (paperData.links?.code) markdown += `**Code:** [${paperData.links.code}](${paperData.links.code})\n\n`;
          markdown += '---\n\n';
        }
      });

      this.downloadFile(markdown, 'papers.md', 'text/markdown');
    },

    downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    handleYearFilter(btn) {
      if (btn.dataset.filter === 'all-years') {
        this.filters.years.clear();
        this.filters.allYears = true;
        document.querySelectorAll('#year-filters .filter-tag').forEach(b => {
          b.dataset.state = b === btn ? 'active' : '';
        });
      } else {
        this.filters.allYears = false;
        const year = btn.dataset.year;
        const state = btn.dataset.state || '';

        if (state === 'active') {
          btn.dataset.state = '';
          this.filters.years.delete(year);
        } else {
          btn.dataset.state = 'active';
          this.filters.years.add(year);
        }

        const allYearsBtn = document.querySelector('[data-filter="all-years"]');
        if (allYearsBtn) allYearsBtn.dataset.state = '';

        if (this.filters.years.size === 0) {
          this.filters.allYears = true;
          if (allYearsBtn) allYearsBtn.dataset.state = 'active';
        }
      }

      this.updateResults();
    },

    handleCategoryFilter(btn) {
      if (btn.dataset.filter === 'all-categories') {
        this.filters.categories.clear();
        this.filters.allCategories = true;
        document.querySelectorAll('#category-filters .filter-tag').forEach(b => {
          b.dataset.state = b === btn ? 'active' : '';
        });
      } else {
        this.filters.allCategories = false;
        const category = btn.dataset.category;
        const state = btn.dataset.state || '';

        if (state === 'active') {
          btn.dataset.state = '';
          this.filters.categories.delete(category);
        } else {
          btn.dataset.state = 'active';
          this.filters.categories.add(category);
        }

        const allCategoriesBtn = document.querySelector('[data-filter="all-categories"]');
        if (allCategoriesBtn) allCategoriesBtn.dataset.state = '';

        if (this.filters.categories.size === 0) {
          this.filters.allCategories = true;
          if (allCategoriesBtn) allCategoriesBtn.dataset.state = 'active';
        }
      }

      this.updateResults();
    },

    handleQuickFilter(btn) {
      const filter = btn.dataset.filter;
      const state = btn.dataset.state || '';

      if (state === 'active') {
        btn.dataset.state = '';
        this.filters.quick.delete(filter);
      } else {
        btn.dataset.state = 'active';
        this.filters.quick.add(filter);
      }

      this.updateResults();
    },

    resetFilters() {
      const searchInput = document.getElementById('search-input');
      const clearSearch = document.getElementById('clear-search');
      const sortSelect = document.getElementById('sort-select');

      if (searchInput) searchInput.value = '';
      if (clearSearch) clearSearch.style.display = 'none';
      this.filters.search = '';

      this.filters.years.clear();
      this.filters.categories.clear();
      this.filters.quick.clear();
      this.filters.allYears = true;
      this.filters.allCategories = true;

      document.querySelectorAll('.filter-tag').forEach(btn => {
        if (btn.dataset.filter === 'all-years' || btn.dataset.filter === 'all-categories') {
          btn.dataset.state = 'active';
        } else {
          btn.dataset.state = '';
        }
      });

      this.sortBy = 'date-desc';
      if (sortSelect) sortSelect.value = 'date-desc';

      this.updateResults();
    },

    matchesFilters(paper) {
      if (this.filters.search) {
        const searchText = paper.dataset.searchText;
        if (!searchText.includes(this.filters.search)) {
          return false;
        }
      }

      if (!this.filters.allYears && this.filters.years.size > 0) {
        if (!this.filters.years.has(paper.dataset.year)) {
          return false;
        }
      }

      if (!this.filters.allCategories && this.filters.categories.size > 0) {
        const paperCategories = paper.dataset.categories.split(',');
        const hasMatch = paperCategories.some(cat => this.filters.categories.has(cat));
        if (!hasMatch) {
          return false;
        }
      }

      if (this.filters.quick.has('starred') && paper.dataset.starred !== 'true') {
        return false;
      }

      if (this.filters.quick.has('has-code') && paper.dataset.hasCode !== 'true') {
        return false;
      }

      if (this.filters.quick.has('foundation') && paper.dataset.type !== 'Foundation') {
        return false;
      }

      return true;
    },

    updateResults() {
      let visiblePapers = Array.from(this.papers).filter(paper => {
        const matches = this.matchesFilters(paper);
        paper.classList.toggle('hidden', !matches);
        return matches;
      });

      visiblePapers = this.sortPapers(visiblePapers);

      const container = document.getElementById('papers-container');
      const resultsCount = document.getElementById('results-count');
      const noResults = document.getElementById('no-results');

      if (container) {
        visiblePapers.forEach(paper => container.appendChild(paper));
      }

      const count = visiblePapers.length;
      if (resultsCount) {
        resultsCount.innerHTML = `Showing <strong>${count}</strong> paper${count !== 1 ? 's' : ''}`;
      }

      if (noResults) {
        noResults.style.display = count === 0 ? 'block' : 'none';
      }
      if (container) {
        container.style.display = count === 0 ? 'none' : 'grid';
      }
    },

    sortPapers(papers) {
      return papers.sort((a, b) => {
        switch(this.sortBy) {
          case 'date-desc':
            return b.dataset.year - a.dataset.year;
          case 'date-asc':
            return a.dataset.year - b.dataset.year;
          case 'relevance-desc':
            return parseFloat(b.dataset.relevance) - parseFloat(a.dataset.relevance);
          case 'title-asc':
            return a.querySelector('.paper-title').textContent.localeCompare(
              b.querySelector('.paper-title').textContent
            );
          case 'citation-desc':
            return parseInt(b.dataset.citation) - parseInt(a.dataset.citation);
          default:
            return 0;
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
  } else {
    app.init();
  }
})();
