(function () {
  const cfg = window.SITE_CONFIG || {};
  const title = cfg.title || "Pathophysiology Study Hub";

  document.querySelectorAll("[data-site-title]").forEach(function (el) {
    el.textContent = title;
  });

  const owner = (cfg.ownerName || "").trim();
  document.querySelectorAll("[data-owner]").forEach(function (el) {
    if (owner) {
      el.textContent = owner;
      el.classList.add("is-on");
      el.hidden = false;
    } else {
      el.textContent = "";
      el.hidden = true;
    }
  });

  if (document.title && document.title.indexOf("{{SITE_TITLE}}") !== -1) {
    document.title = document.title.replace("{{SITE_TITLE}}", title);
  } else if (document.title && document.title.indexOf(title) === -1 && document.body && document.body.dataset.pageTitle) {
    document.title = document.body.dataset.pageTitle + " · " + title;
  }

  const path = (location.pathname || "").replace(/\\/g, "/");
  document.querySelectorAll(".nav a[data-nav]").forEach(function (a) {
    const key = a.getAttribute("data-nav");
    const map = {
      home: /(?:^|\/)(index\.html)?$/.test(path) && path.indexOf("/powerpoints") === -1 && path.indexOf("/practice") === -1 && path.indexOf("/docs") === -1 && path.indexOf("/videos") === -1 && path.indexOf("/review-guides") === -1 && path.indexOf("/downloads") === -1,
      powerpoints: path.indexOf("/powerpoints") !== -1,
      practice: path.indexOf("/practice") !== -1,
      docs: path.indexOf("/docs") !== -1,
      videos: path.indexOf("/videos") !== -1,
      guides: path.indexOf("/review-guides") !== -1,
      downloads: path.indexOf("/downloads") !== -1
    };
    if (map[key]) a.setAttribute("aria-current", "page");
  });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const search = document.querySelector("#site-search");
  if (search) {
    const cards = Array.from(document.querySelectorAll("[data-search]"));
    const count = document.querySelector(".search-count");
    const empty = document.querySelector(".empty-search");
    function apply() {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      cards.forEach(function (card) {
        const hay = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        const ok = !q || hay.indexOf(q) !== -1;
        card.classList.toggle("is-hidden", !ok);
        if (ok) shown += 1;
      });
      if (count) count.textContent = q ? shown + " shown" : "";
      if (empty) empty.classList.toggle("show", shown === 0);
    }
    search.addEventListener("input", apply);
    apply();
  }
})();
