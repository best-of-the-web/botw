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

// adjust paths if header/footer live somewhere else
loadFragment("site-header", "header.html");
loadFragment("site-footer", "footer.html");
loadFragment("site-sidebar", "sidebar.html");
