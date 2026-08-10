(function () {
  "use strict";

  const grid = document.querySelector("[data-home-grid]");
  if (!grid) return;

  const projects = typeof PROJECTS !== "undefined" ? PROJECTS : [];
  const industry = typeof INDUSTRY_ROLES !== "undefined" ? INDUSTRY_ROLES : [];

  const items = [...projects, ...industry].sort((a, b) => {
    const dateA = a.date || "0000-00";
    const dateB = b.date || "0000-00";
    return dateB.localeCompare(dateA);
  });

  function tileMarkup(p, index) {
    const num = String(index + 1).padStart(2, "0");
    const kindLabel = p.kind === "industry" ? "Industry" : "Project";
    return `
      <a class="gallery-item reveal" href="${p.slug}">
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
          <div class="item-meta"><span>${p.year}</span><span>·</span><span>${p.org}</span><span>·</span><span>${kindLabel}</span></div>
          <h3 class="item-title">${p.title}</h3>
          <div class="item-tags">${(p.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}</div>
          <span class="item-view">View project <span aria-hidden="true">&rarr;</span></span>
        </div>
      </a>`;
  }

  grid.innerHTML = items.map(tileMarkup).join("");

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }),
    { threshold: 0.1 }
  );
  grid.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  grid.querySelectorAll(".media-frame").forEach((frame) => {
    const img = frame.querySelector("img");
    if (!img || !img.getAttribute("src")) { frame.classList.add("is-missing"); return; }
    img.addEventListener("error", () => frame.classList.add("is-missing"), { once: true });
  });
})();
