// Function to check if a script is already in the document
function scriptExists(src) {
  return document.querySelector(`script[src="${src}"]`) !== null;
}

async function loadLayout(file, target, isHeaderContent) {
  try {
    debugger;
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

    // Inject the HTML content
    document.querySelector(target).innerHTML = html;
    let mainScriptUrl = "assets/js/main.js";
    if (!scriptExists(mainScriptUrl)) {
      let mainScript = document.createElement("script");
      mainScript.src = mainScriptUrl;
      document.body.appendChild(mainScript);
    }
  } catch (err) {
    console.error(err);
  }
}

loadLayout("/pages/layouts/header-layout.html", "#header-layout", true);
loadLayout("/pages/layouts/footer-layout.html", "#footer-layout");
