const profileRoot = document.querySelector("#profile-content");
const authForm = document.querySelector("#auth-form");

function getProfiles() {
  try { return JSON.parse(localStorage.getItem("internpath.profiles") || "[]"); }
  catch { return []; }
}

if (authForm) {
  authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(authForm);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const name = String(data.get("name") || "").trim();
    const mode = authForm.dataset.mode;
    const profiles = getProfiles();
    let profile = profiles.find((item) => item.email === email);
    if (mode === "register") {
      if (profile) return notify("An account with that email already exists on this browser.");
      profile = { name, email };
      profiles.push(profile);
      localStorage.setItem("internpath.profiles", JSON.stringify(profiles));
    } else if (!profile) {
      return notify("We couldn't find a demo profile for that email. Create one first.");
    }
    localStorage.setItem("internpath.user", JSON.stringify(profile));
    location.href = "profile.html";
  });
}

if (profileRoot) {
  let user = null;
  try { user = JSON.parse(localStorage.getItem("internpath.user") || "null"); } catch { user = null; }
  if (!user) {
    profileRoot.innerHTML = `<div class="panel empty-state"><strong>You're not signed in</strong>Sign in or create a demo profile to see your profile here.<p><a class="button button-primary button-small" href="login.html">Sign in</a></p></div>`;
  } else {
    const initial = user.name.trim().charAt(0).toUpperCase();
    profileRoot.innerHTML = `<div class="panel profile-card"><div class="profile-avatar">${escapeHTML(initial)}</div><div><h2>${escapeHTML(user.name)}</h2><p>${escapeHTML(user.email)}</p></div></div>
      <div class="panel" style="margin-top:14px"><p>Your profile is stored in this browser for this demo.</p><button class="button button-light button-small" id="sign-out" type="button">Sign out</button></div>`;
    document.querySelector("#sign-out").addEventListener("click", () => {
      localStorage.removeItem("internpath.user");
      location.reload();
    });
  }
}

function notify(message) {
  window.dispatchEvent(new CustomEvent("internpath:toast", { detail: message }));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
