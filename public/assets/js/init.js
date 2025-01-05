async function loadLayout(file, target) {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Error loading ${file}: ${response.statusText}`);
    }
    const html = await response.text();
    document.querySelector(target).innerHTML = html;
    var script = document.createElement("script");
    script.src = "assets/js/main.js";
    document.body.appendChild(script);
  } catch (err) {
    console.error(err);
  }
}
