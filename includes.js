async function loadFragment(targetId, file) {
  const el = document.getElementById(targetId);
  if (!el) return;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(res.status + " " + res.statusText);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error("Failed to load", file, err);
  }
}

loadFragment("site-header", "header.html");
loadFragment("site-sidebar", "sidebar.html");
loadFragment("site-footer", "footer.html").then(() => {
  const upd = document.getElementById("footer-updated");
  if (upd) upd.textContent = "Updated: " + new Date().toDateString();
});

document.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("randomLink");
  if (!link) return;

  const RANDOM_PAGES = [
    "videos.html",
    "pictures.html",
    "games.html",
    "tools.html",
    "newsletter.html",
    "how-old-is-he.html"
    // Add more as you create new pages
  ];

  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = RANDOM_PAGES[Math.floor(Math.random() * RANDOM_PAGES.length)];
    window.location.href = page;
  });
});
