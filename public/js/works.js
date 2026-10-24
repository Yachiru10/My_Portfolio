// works.js runs on the Works page.
// 1. It loads the projects from the backend (/api/projects reads Supabase).
// 2. It draws the project cards and the filter buttons.
// 3. It opens the project popup with the image slider.

const grid = document.querySelector('[data-grid]');
const modal = document.querySelector('[data-modal]');

let projects = [];
let activeFilter = 'all';
let lastClickedCard = null;

// The popup's current state
let current = null; // the project shown in the popup
let currentTab = 0; // which tab (ECOLINK only)
let currentImage = 0; // which image in the slider

// ---------- Small helper to create elements safely ----------
// Using textContent (not innerHTML) means text from the database
// can never run as code on the page.
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

// ---------- 1. Load the projects ----------
async function loadProjects() {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('API returned ' + response.status);
    return await response.json();
  } catch (error) {
    // If the API is not running (for example, during a simple local preview),
    // use the copy of the data that ships with the site.
    console.warn('Could not reach /api/projects. Using the local copy.', error);
    const response = await fetch('/data/projects.json');
    return await response.json();
  }
}

// ---------- 2. Cards and filters ----------
function buildCard(project) {
  const card = el('button', 'project-card');
  card.type = 'button';
  card.setAttribute('aria-label', 'View ' + project.title + ' project details');

  const media = el('span', 'relative block h-60 w-full overflow-hidden bg-surface2');
  const img = el('img', 'h-full w-full object-cover object-left-top');
  img.src = project.card_image;
  img.alt = '';
  img.loading = 'lazy';
  media.append(img);

  if (project.card_phone_image) {
    const phone = el('img', 'absolute -bottom-10 right-[18px] h-[210px] w-[104px] rounded-2xl border-4 border-surface object-cover object-top shadow-2xl');
    phone.src = project.card_phone_image;
    phone.alt = '';
    phone.loading = 'lazy';
    media.append(phone);
  }
  media.append(el('span', 'overlay', 'VIEW PROJECT ↗'));

  const body = el('span', 'flex flex-1 flex-col gap-3.5 p-[26px] pb-7');
  const chips = el('span', 'flex flex-wrap gap-2');
  project.chips.forEach((chip) => chips.append(el('span', 'chip', chip)));
  chips.append(el('span', 'chip-plain', project.year));

  const tags = el('span', 'mt-auto flex flex-wrap gap-2 border-t border-line pt-4');
  project.card_tags.forEach((tag) => tags.append(el('span', 'tag', tag)));

  body.append(
    chips,
    el('span', 'font-display text-3xl font-bold leading-tight tracking-tight', project.title),
    el('span', 'text-[15px] leading-relaxed text-muted', project.card_summary),
    tags
  );

  card.append(media, body);
  card.addEventListener('click', () => {
    lastClickedCard = card;
    openModal(project);
  });
  return card;
}

function renderGrid() {
  grid.replaceChildren();
  projects
    .filter((p) => activeFilter === 'all' || p.category === activeFilter)
    .forEach((p) => grid.append(buildCard(p)));
}

function setupFilters() {
  // Show how many projects are in each group
  document.querySelector('[data-count="all"]').textContent = projects.length;
  document.querySelector('[data-count="backend"]').textContent = projects.filter((p) => p.category === 'backend').length;
  document.querySelector('[data-count="frontend"]').textContent = projects.filter((p) => p.category === 'frontend').length;

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b === button));
      });
      renderGrid();
    });
  });
}

// ---------- 3. The popup ----------
function q(name) {
  return modal.querySelector('[data-m-' + name + ']');
}

// The images for the current tab (or all images if there are no tabs)
function currentImages() {
  if (current.gallery.tabs) return current.gallery.tabs[currentTab].images;
  return current.gallery.images;
}

function showImage() {
  const images = currentImages();
  const image = images[currentImage];
  q('img').src = image.src;
  q('img').alt = image.alt;
  q('counter').textContent = currentImage + 1 + ' / ' + images.length;

  // Hide the arrows when there is only 1 image
  const many = images.length > 1;
  ['prev', 'next'].forEach((name) => {
    q(name).classList.toggle('hidden', !many);
    q(name).classList.toggle('flex', many);
  });

  // Thumbnails
  const thumbs = q('thumbs');
  thumbs.replaceChildren();
  images.forEach((img, index) => {
    const button = el('button', 'h-[66px] w-[104px] shrink-0 overflow-hidden rounded-xl border-2 bg-bg transition-opacity');
    button.type = 'button';
    button.setAttribute('aria-label', 'Show image ' + (index + 1) + ' of ' + images.length);
    const active = index === currentImage;
    button.style.borderColor = active ? 'var(--accent)' : 'transparent';
    button.style.opacity = active ? '1' : '0.6';
    if (active) button.setAttribute('aria-current', 'true');
    const thumb = el('img', 'h-full w-full object-cover object-top');
    thumb.src = img.src;
    thumb.alt = '';
    button.append(thumb);
    button.addEventListener('click', () => {
      currentImage = index;
      showImage();
    });
    thumbs.append(button);
  });
}

function showTabs() {
  const wrap = q('tabwrap');
  const tabs = current.gallery.tabs;
  wrap.classList.toggle('hidden', !tabs);
  wrap.classList.toggle('flex', !!tabs);
  if (!tabs) return;

  const list = q('tabs');
  list.replaceChildren();
  tabs.forEach((tab, index) => {
    const button = el('button', 'tab-btn', tab.label);
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(index === currentTab));
    button.addEventListener('click', () => {
      currentTab = index;
      currentImage = 0;
      showTabs();
      showImage();
    });
    list.append(button);
  });
  q('tabnote').textContent = tabs[currentTab].note;
}

function fillList(container, items, makeItem) {
  container.replaceChildren();
  items.forEach((item) => container.append(makeItem(item)));
}

function openModal(project) {
  current = project;
  currentTab = 0;
  currentImage = 0;

  fillList(q('chips'), project.chips, (chip) => el('span', 'chip', chip));
  q('title').textContent = project.title;
  q('role').textContent = project.role;
  q('year').textContent = project.year;
  q('overview').textContent = project.overview;

  fillList(q('features'), project.features, (text) => {
    const li = el('li', 'flex items-start gap-3 rounded-[14px] border border-line bg-surface2 px-4 py-[13px] text-[15px] leading-normal');
    li.innerHTML = '<svg class="mt-px h-5 w-5 shrink-0 text-accent" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>';
    li.append(el('span', '', text));
    return li;
  });

  const hasDecisions = Array.isArray(project.decisions) && project.decisions.length > 0;
  q('decisions-wrap').classList.toggle('hidden', !hasDecisions);
  q('decisions-wrap').classList.toggle('flex', hasDecisions);
  if (hasDecisions) {
    fillList(q('decisions'), project.decisions, (d) => {
      const box = el('div', 'flex flex-col gap-1 rounded-[14px] border px-4 py-3.5');
      box.style.borderColor = 'var(--chip-border)';
      box.style.background = 'var(--chip-bg)';
      box.append(el('span', 'text-[15px] font-bold', d.q), el('span', 'text-[14.5px] leading-relaxed text-muted', d.a));
      return box;
    });
  }

  const hl = project.highlight;
  q('highlight').classList.toggle('hidden', !hl);
  q('highlight').classList.toggle('flex', !!hl);
  if (hl) {
    q('hl-big').textContent = hl.big;
    q('hl-sub').textContent = hl.sub;
    q('hl-text').textContent = hl.text;
  }

  fillList(q('tech'), project.tech, (t) => el('span', 'skill', t));

  q('live').href = project.live_url;
  q('live').textContent = project.live_label + ' ↗';
  q('note').textContent = project.note || '';
  q('note').classList.toggle('hidden', !project.note);

  showTabs();
  showImage();

  modal.showModal();
  history.replaceState(null, '', '#' + project.slug);
}

function closeModal() {
  modal.close();
}

function step(direction) {
  const total = currentImages().length;
  currentImage = (currentImage + direction + total) % total;
  showImage();
}

q('close').addEventListener('click', closeModal);
q('prev').addEventListener('click', () => step(-1));
q('next').addEventListener('click', () => step(1));

// Left and right arrow keys move the slider while the popup is open
modal.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') step(-1);
  if (event.key === 'ArrowRight') step(1);
});

// Clicking the dark area outside the popup closes it
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

// When the popup closes (button, Esc key or outside click)
modal.addEventListener('close', () => {
  history.replaceState(null, '', location.pathname);
  if (lastClickedCard) lastClickedCard.focus();
});

// ---------- Start ----------
(async function start() {
  try {
    projects = await loadProjects();
    projects.sort((a, b) => a.sort_order - b.sort_order);
    setupFilters();
    renderGrid();

    // Links like /works#ecolink (from the Home page) open that project right away
    const slug = location.hash.slice(1);
    const fromLink = projects.find((p) => p.slug === slug);
    if (fromLink) openModal(fromLink);
  } catch (error) {
    console.error(error);
    grid.replaceChildren(el('p', 'text-muted', 'Sorry, the projects could not load. Please refresh the page.'));
  }
})();
