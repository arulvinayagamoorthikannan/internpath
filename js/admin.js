import { internships } from "./data/internships.js";

const form = document.querySelector("#internship-form");
const list = document.querySelector("#admin-list");

function readCustom() {
  try {
    const items = JSON.parse(localStorage.getItem("internpath.customInternships") || "[]");
    return Array.isArray(items) ? items : [];
  } catch { return []; }
}

function render() {
  if (!list) return;
  const custom = readCustom();
  const all = [...custom, ...internships];
  list.innerHTML = all.map((job) => `<div class="admin-row"><div><strong>${escapeHTML(job.role)}</strong><small>${escapeHTML(job.company)} · ${escapeHTML(job.location)}</small></div>${custom.some((item) => item.id === job.id) ? `<button class="button button-light button-small" type="button" data-delete="${escapeHTML(job.id)}">Remove</button>` : ""}</div>`).join("");
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const job = {
    id: `custom-${Date.now()}`,
    company: String(data.get("company")).trim(),
    role: String(data.get("role")).trim(),
    category: String(data.get("category")),
    location: String(data.get("city")).trim(),
    type: String(data.get("type")),
    duration: String(data.get("duration")).trim(),
    stipend: String(data.get("stipend")).trim(),
    logo: "✳",
    tags: [],
    description: String(data.get("description")).trim()
  };
  const custom = readCustom();
  custom.unshift(job);
  localStorage.setItem("internpath.customInternships", JSON.stringify(custom));
  form.reset();
  render();
  window.dispatchEvent(new CustomEvent("internpath:toast", { detail: "Internship added to the local demo listings." }));
});

list?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  localStorage.setItem("internpath.customInternships", JSON.stringify(readCustom().filter((job) => job.id !== button.dataset.delete)));
  render();
});

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

render();
