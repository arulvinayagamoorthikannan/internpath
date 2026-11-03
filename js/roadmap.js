import { roadmaps } from "./data/roadmaps.js";

const grid = document.querySelector("#roadmap-grid");
const detail = document.querySelector("#roadmap-detail");
const progressKey = "internpath.roadmapProgress";

function readProgress() {
  try { return JSON.parse(localStorage.getItem(progressKey) || "{}"); } catch { return {}; }
}

function renderCards() {
  if (!grid) return;
  grid.innerHTML = roadmaps.map((roadmap) => `
    <article class="roadmap-card"><span class="tag">${escapeHTML(roadmap.category)} · ${escapeHTML(roadmap.duration)}</span>
      <h3>${escapeHTML(roadmap.title)}</h3><p>${escapeHTML(roadmap.description)}</p>
      <button class="button button-light button-small open-roadmap" type="button" data-roadmap="${roadmap.id}">View roadmap <span aria-hidden="true">→</span></button>
    </article>`).join("");
}

function renderDetail(id) {
  const roadmap = roadmaps.find((item) => item.id === id);
  if (!detail || !roadmap) return;
  const progress = readProgress();
  const completeSteps = new Set(progress[id] || []);
  detail.innerHTML = `<div class="panel"><div class="section-heading"><div><span class="eyebrow">${escapeHTML(roadmap.category)} · ${escapeHTML(roadmap.duration)}</span><h2>${escapeHTML(roadmap.title)} roadmap</h2></div></div>
    <p>${escapeHTML(roadmap.description)} Mark steps as complete to track your progress.</p>
    ${roadmap.steps.map((step, index) => {
      const done = completeSteps.has(index);
      return `<button class="roadmap-step${done ? " done" : ""}" type="button" data-step="${index}" data-roadmap="${id}" aria-pressed="${done}" style="width:100%;text-align:left;background:transparent;border:0;cursor:pointer">
        <span class="step-check">${done ? "✓" : index + 1}</span><span><h3>${escapeHTML(step.title)}</h3><p>${escapeHTML(step.detail)}</p></span></button>`;
    }).join("")}</div>`;
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

grid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-roadmap]");
  if (button) renderDetail(button.dataset.roadmap);
});

detail?.addEventListener("click", (event) => {
  const step = event.target.closest("[data-step]");
  if (!step) return;
  const progress = readProgress();
  const id = step.dataset.roadmap;
  const selected = new Set(progress[id] || []);
  const index = Number(step.dataset.step);
  selected.has(index) ? selected.delete(index) : selected.add(index);
  progress[id] = [...selected];
  localStorage.setItem(progressKey, JSON.stringify(progress));
  renderDetail(id);
});

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

renderCards();
const initialRoadmap = new URLSearchParams(location.search).get("career");
if (initialRoadmap) renderDetail(initialRoadmap);
