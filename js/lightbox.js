(function () {
  "use strict";

  const triggers = document.querySelectorAll("[data-lightbox]");
  if (!triggers.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close image">✕</button>
    <img src="" alt="">
    <div class="lightbox-caption" data-lightbox-caption></div>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector("img");
  const captionEl = overlay.querySelector("[data-lightbox-caption]");
  const closeBtn = overlay.querySelector(".lightbox-close");

  function open(src, alt, caption) {
    if (!src) return;
    imgEl.src = src;
    imgEl.alt = alt || "";
    captionEl.textContent = caption || "";
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      const img = trigger.querySelector("img");
      if (!img || trigger.classList.contains("is-missing")) return;
      e.preventDefault();
      const full = trigger.dataset.full || img.currentSrc || img.src;
      const caption = trigger.dataset.caption || img.alt;
      open(full, img.alt, caption);
    });
  });

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
})();
