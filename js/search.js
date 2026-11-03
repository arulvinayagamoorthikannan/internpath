import { internships } from "./data/internships.js";

const form = document.querySelector("#internship-filters");
const results = document.querySelector("#internship-results");
const count = document.querySelector("#results-count");
if (form && results && count) {
  const queryInput = form.elements.namedItem("q");
  const params = new URLSearchParams(location.search);
  if (queryInput) queryInput.value = params.get("q") || "";

  function getCustomInternships() {
    try { return JSON.parse(localStorage.getItem("internpath.customInternships") || "[]"); }
    catch { return []; }
  }

  function render() {
    const query = (form.elements.namedItem("q").value || "").trim().toLowerCase();
    const category = form.elements.namedItem("category").value;
    const locationFilter = form.elements.namedItem("location").value;
    const jobs = [...getCustomInternships(), ...internships].filter((job) => {
      const searchable = [job.role, job.company, job.category, job.location, ...job.tags].join(" ").toLowerCase();
      return (!query || searchable.includes(query))
        && (!category || job.category === category)
        && (!locationFilter || job.type === locationFilter);
    });
    count.textContent = `${jobs.length} ${jobs.length === 1 ? "opportunity" : "opportunities"} found`;
    results.innerHTML = jobs.length ? jobs.map((job) => `
      <article class="internship-card">
        <div class="job-top"><span class="company-mark">${escapeHTML(job.logo || "✳")}</span><span class="tag">${escapeHTML(job.type)}</span></div>
        <p class="company-name">${escapeHTML(job.company)}</p><h3>${escapeHTML(job.role)}</h3>
        <p class="description">${escapeHTML(job.description)}</p>
        <div class="job-meta"><span>⌖ ${escapeHTML(job.location)}</span><span>◷ ${escapeHTML(job.duration)}</span></div>
        <div class="job-bottom"><span class="stipend">${escapeHTML(job.stipend)}</span><button class="button button-primary button-small track-job" type="button" data-id="${escapeHTML(job.id)}">Track application</button></div>
      </article>`).join("") : `<div class="empty-state"><strong>No internships match yet</strong>Try changing a filter or searching for a different skill.</div>`;
  }

  form.addEventListener("input", render);
  form.addEventListener("change", render);
  form.addEventListener("submit", (event) => { event.preventDefault(); render(); });
  results.addEventListener("click", (event) => {
    const button = event.target.closest(".track-job");
    if (!button) return;
    let tracked = [];
    try { tracked = JSON.parse(localStorage.getItem("internpath.applications") || "[]"); } catch { tracked = []; }
    if (tracked.some((item) => item.id === button.dataset.id)) {
      window.dispatchEvent(new CustomEvent("internpath:toast", { detail: "This internship is already in your tracker." }));
      return;
    }
    const job = [...getCustomInternships(), ...internships].find((item) => item.id === button.dataset.id);
    if (!job) return;
    tracked.unshift({ id: job.id, company: job.company, role: job.role, status: "Interested", updatedAt: new Date().toISOString() });
    localStorage.setItem("internpath.applications", JSON.stringify(tracked));
    window.dispatchEvent(new CustomEvent("internpath:toast", { detail: "Added to your application tracker." }));
  });
  render();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
