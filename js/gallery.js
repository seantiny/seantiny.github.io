(function () {
  "use strict";

  const DATA = typeof PROJECTS !== "undefined" ? PROJECTS
             : typeof INDUSTRY_ROLES !== "undefined" ? INDUSTRY_ROLES
             : null;
  if (!DATA) return;

  const grid = document.querySelector("[data-gallery-grid]");
  const searchInput = document.querySelector("[data-gallery-search]");
  const tagWrap = document.querySelector("[data-gallery-tags]");
  const countEl = document.querySelector("[data-gallery-count]");
  const noResults = document.querySelector("[data-gallery-empty]");
  if (!grid) return;

  const countNoun = (countEl && countEl.dataset.noun) || "project";

  const allTags = Array.from(new Set(DATA.flatMap((p) => p.tags))).sort();

    const state = { tag: "all", query: "" };

  function buildTags() {
    const allBtn = makeTagButton("All work", "all", true);
    tagWrap.appendChild(allBtn);
    allTags.forEach((tag) => tagWrap.appendChild(makeTagButton(tag, tag, false)));
  }

  function makeTagButton(label, value, active) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-tag" + (active ? " is-active" : "");
    btn.textContent = label;
    btn.dataset.value = value;
    btn.addEventListener("click", () => {
      state.tag = value;
      tagWrap.querySelectorAll(".filter-tag").forEach((b) => b.classList.toggle("is-active", b === btn));
      render();
    });
    return btn;
  }

    function itemMarkup(p, index) {
    const num = String(index + 1).padStart(2, "0");
    return `
      <a class="gallery-item reveal" href="${p.slug}" data-title="${p.title.toLowerCase()}" data-org="${p.org.toLowerCase()}" data-tags="${p.tags.join(",").toLowerCase()}">
        <div class="media-frame" style="--ratio:4/3; --thumb-fit:${p.thumbFit || "cover"}; --item-bg:${p.bgColor || "var(--navy)"};">
          <img src="${p.thumb}" alt="${p.title} — ${p.org}" loading="lazy" style="transform: rotate(${p.rotate || "0deg"});">
          <div class="frame-fallback">
            <div class="crosshair"></div>
            <span class="frame-label">FIG.${num} / ${p.id}</span>
            <span class="frame-coord">${p.year}</span>
          </div>
        </div>
        <div class="item-overlay"></div>
        <div class="item-body">
          <div class="item-meta"><span>${p.year}</span><span>·</span><span>${p.org}</span></div>
          <h3 class="item-title">${p.title}</h3>
          <div class="item-tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
          <span class="item-view">View project <span aria-hidden="true">&rarr;</span></span>
        </div>
      </a>`;
  }

  function renderGrid() {
    grid.innerHTML = DATA.map(itemMarkup).join("");

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    grid.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  function render() {
    const items = grid.querySelectorAll(".gallery-item");
    let visible = 0;
    items.forEach((el) => {
      const matchesTag = state.tag === "all" || el.dataset.tags.split(",").includes(state.tag.toLowerCase());
      const matchesQuery =
        state.query === "" ||
        el.dataset.title.includes(state.query) ||
        el.dataset.org.includes(state.query);
      const show = matchesTag && matchesQuery;
      el.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    if (countEl) countEl.textContent = `${visible} ${countNoun}${visible === 1 ? "" : "s"}`;
    if (noResults) noResults.classList.toggle("is-visible", visible === 0);
  }

  renderGrid();
  buildTags();
  render();

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.query = e.target.value.trim().toLowerCase();
      render();
    });
  }
})();
