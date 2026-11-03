const navItems = [
  ["Internships", "pages/internships.html", "internships"],
  ["Roadmaps", "pages/roadmaps.html", "roadmaps"],
  ["Tracker", "pages/tracker.html", "tracker"]
];

const currentPage = location.pathname.split("/").pop() || "index.html";
const links = navItems.map(([label, href, key]) => {
  const active = currentPage === `${key}.html` ? ' aria-current="page"' : "";
  return `<a href="${relativeHref(href)}"${active}>${label}</a>`;
}).join("");

function relativeHref(rootPath) {
  return currentPage === "index.html" ? rootPath : `../${rootPath}`;
}

function renderChrome() {
  const header = document.querySelector("#site-header");
  if (header) header.innerHTML = `
    <header class="site-header"><div class="container nav-wrap">
      <a class="brand" href="${relativeHref("index.html")}"><span class="brand-mark">↗</span> InternPath</a>
      <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
      <nav class="nav-links" aria-label="Main navigation">${links}<a href="${relativeHref("pages/admin.html")}">Admin</a></nav>
      <div class="nav-actions"><a class="button button-light button-small" href="${relativeHref("pages/login.html")}">Sign in</a><a class="button button-primary button-small" href="${relativeHref("pages/register.html")}">Get started</a></div>
    </div></header>`;
  const footer = document.querySelector("#site-footer");
  if (footer) footer.innerHTML = `
    <footer class="site-footer"><div class="container footer-inner">
      <a class="brand" href="${relativeHref("index.html")}"><span class="brand-mark">↗</span> InternPath</a>
      <span>Small steps. Real experience. A path that is yours.</span>
      <div class="footer-links"><a href="${relativeHref("pages/internships.html")}">Internships</a><a href="${relativeHref("pages/roadmaps.html")}">Roadmaps</a><a href="${relativeHref("pages/profile.html")}">Profile</a></div>
    </div></footer>`;
  const toggle = document.querySelector(".menu-toggle");
  toggle?.addEventListener("click", () => {
    const nav = document.querySelector(".nav-links");
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav?.classList.toggle("open", !expanded);
  });
  const user = readUser();
  const authLink = document.querySelector('.nav-actions a[href$="login.html"]');
  if (user && authLink) {
    authLink.textContent = user.name.split(/\s+/)[0];
    authLink.href = relativeHref("pages/profile.html");
  }
}

function readUser() {
  try { return JSON.parse(localStorage.getItem("internpath.user") || "null"); }
  catch { return null; }
}

let toastTimer;
function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

renderChrome();
window.addEventListener("internpath:toast", (event) => showToast(event.detail));
