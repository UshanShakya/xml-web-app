async function loadLayout(file, target, isHeaderContent) {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Error loading ${file}: ${response.statusText}`);
    }
    let html = await response.text();
    if (isHeaderContent) {
      const pathname = window.location.pathname;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const links = doc.querySelectorAll("#navmenu a");
      links.forEach((link) => {
        if (link.getAttribute("href") === pathname) {
          debugger;
          link.classList.add("active");
        }
      });
      html = doc.body.innerHTML;
    }
    document.querySelector(target).innerHTML = html;
    var script = document.createElement("script");
    script.src = "assets/js/main.js";
    document.body.appendChild(script);
  } catch (err) {
    console.error(err);
  }
}

loadLayout("/pages/layouts/header-layout.html", "#header-layout", true);
loadLayout("/pages/layouts/footer-layout.html", "#footer-layout");
