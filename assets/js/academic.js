(() => {
  const toolbar = document.getElementById('publication-filters');
  if (!toolbar) return;
  const buttons = [...toolbar.querySelectorAll('[data-filter]')];
  const publications = [...document.querySelectorAll('.publication')];
  const count = document.getElementById('publication-count');
  const filter = (value) => {
    let visible = 0;
    publications.forEach((publication) => {
      const matches = value === 'all' || (value === 'selected'
        ? publication.dataset.selected === 'true'
        : publication.dataset.topic === value);
      publication.hidden = !matches;
      if (matches) visible += 1;
    });
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
    count.textContent = `${visible} ${visible === 1 ? 'publication' : 'publications'}`;
  };
  buttons.forEach((button) => button.addEventListener('click', () => filter(button.dataset.filter)));
  toolbar.hidden = false;
  filter('selected');
})();
