// ------------------------------------------------------------
// Universal Gallery Script for Greg's Best of the Web
// Loads JSON, builds tabs, builds grid
// Fields expected:
// { title, thumb, url, category, desc }
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const jsonFile = document.body.dataset.json;
  const tabsEl = document.querySelector(".tabs");
  const gridEl = document.querySelector(".thumb-grid");

  if (!jsonFile) {
    console.error("No data-json attribute found on <body>");
    return;
  }

  let allItems = [];
  let filtered = [];

  load(jsonFile);

  // ------------------------------------------------------------
  async function load(file) {
    try {
      const res = await fetch(file + "?v=" + Date.now());
      if (!res.ok) throw new Error(res.status + " " + res.statusText);

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("JSON must be an array");

      allItems = data;
      buildTabs();
      filter("All");
    } catch (err) {
      console.error("Gallery load error:", err);
      gridEl.innerHTML = "<p class='center'><small>Failed to load gallery.</small></p>";
    }
  }

  // ------------------------------------------------------------
  function buildTabs() {
    const categories = new Set();
    allItems.forEach(i => i.category && categories.add(i.category));

    const list = ["All", ...Array.from(categories).sort()];

    tabsEl.innerHTML = list
      .map(cat => `<button class="tab" data-cat="${cat}">${cat}</button>`)
      .join("");

    tabsEl.addEventListener("click", e => {
      const btn = e.target.closest(".tab");
      if (!btn) return;
      filter(btn.dataset.cat);
    });
  }

  // ------------------------------------------------------------
  function filter(cat) {
    filtered = cat === "All"
      ? [...allItems]
      : allItems.filter(i => i.category === cat);

    document.querySelectorAll(".tab").forEach(btn =>
      btn.classList.toggle("active", btn.dataset.cat === cat)
    );

    render();
  }

  // ------------------------------------------------------------
  function render() {
    gridEl.innerHTML = "";

    if (!filtered.length) {
      gridEl.innerHTML = "<p class='center'><small>No items found.</small></p>";
      return;
    }

    filtered.forEach(item => {
      const title = item.title || "Untitled";
      const thumb = item.thumb || "";
      const desc  = item.desc  || "";
      const url   = item.url   || null;

      const card = document.createElement("div");
      card.className = "thumb-card";

      const linkStart = url ? `<a href="${url}" target="_blank" rel="noopener">` : "";
      const linkEnd   = url ? `</a>` : "";

      card.innerHTML = `
        ${linkStart}
          <img src="${thumb}" alt="${title}" loading="lazy">
        ${linkEnd}
        <small><strong>${title}</strong>${desc ? " – " + desc : ""}</small>
      `;

      gridEl.appendChild(card);
    });
  }
});
