const list = document.querySelector("#tracker-list");
const stats = document.querySelector("#tracker-stats");
const stages = ["Interested", "Applied", "Interviewing", "Offer", "Rejected"];

function readApplications() {
  try {
    const items = JSON.parse(localStorage.getItem("internpath.applications") || "[]");
    return Array.isArray(items) ? items : [];
  } catch { return []; }
}

function saveApplications(items) {
  localStorage.setItem("internpath.applications", JSON.stringify(items));
}

function render() {
  if (!list) return;
  const items = readApplications();
  if (stats) stats.innerHTML = `
    <div class="stat-card"><strong>${items.length}</strong><span>Tracked opportunities</span></div>
    <div class="stat-card"><strong>${items.filter((item) => item.status === "Applied").length}</strong><span>Applications sent</span></div>
    <div class="stat-card"><strong>${items.filter((item) => item.status === "Interviewing").length}</strong><span>Interviews</span></div>`;
  list.innerHTML = items.length ? items.map((item) => `
    <article class="tracker-item">
      <div><h3>${escapeHTML(item.role)}</h3><p>${escapeHTML(item.company)} · Added ${new Date(item.updatedAt).toLocaleDateString()}</p></div>
      <label class="sr-only" for="stage-${escapeHTML(item.id)}">Application stage for ${escapeHTML(item.role)}</label>
      <select id="stage-${escapeHTML(item.id)}" data-id="${escapeHTML(item.id)}">${stages.map((stage) => `<option${item.status === stage ? " selected" : ""}>${stage}</option>`).join("")}</select>
      <button class="button button-light button-small remove-button" type="button" data-remove="${escapeHTML(item.id)}">Remove</button>
    </article>`).join("") : `<div class="empty-state"><strong>Your tracker is ready when you are</strong>Browse internships and choose “Track application” to add your first opportunity.</div>`;
}

list?.addEventListener("change", (event) => {
  const select = event.target.closest("select[data-id]");
  if (!select) return;
  const items = readApplications();
  const item = items.find((entry) => entry.id === select.dataset.id);
  if (item) { item.status = select.value; item.updatedAt = new Date().toISOString(); saveApplications(items); render(); }
});

list?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  saveApplications(readApplications().filter((item) => item.id !== button.dataset.remove));
  render();
});

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

render();
