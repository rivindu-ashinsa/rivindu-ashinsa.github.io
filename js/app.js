import { loadAllData } from "./core/data.js";
import { renderChrome } from "./core/chrome.js";
import { injectSchema } from "./core/seo.js";
import { initTheme, initNav, initReveal } from "./modules/chrome-ui.js";
import { initCommand } from "./modules/command.js";
import {
  pageHome,
  pageUpdates,
  pageLinkedin,
  pageApps,
  pageSuggested,
  pageLearning,
  pageWork,
  pageStudio,
  pageCredentials,
  pageContact
} from "./pages/index.js";

document.body.classList.add("js");
initTheme();

const routes = {
  home: pageHome,
  updates: pageUpdates,
  linkedin: pageLinkedin,
  apps: pageApps,
  suggested: pageSuggested,
  learning: pageLearning,
  work: pageWork,
  studio: pageStudio,
  credentials: pageCredentials,
  contact: pageContact
};

try {
  const data = await loadAllData();
  const page = document.body.dataset.page || "home";
  renderChrome(data.site, page);
  injectSchema(page, data);
  initNav();
  initCommand(data);
  const render = routes[page];
  if (render) render(data);
  initReveal();
} catch (error) {
  const stage = document.getElementById("stage");
  if (stage) {
    stage.insertAdjacentHTML(
      "afterbegin",
      `<p class="card">This atlas loads from JSON files. Serve the folder over HTTP (for example <code>python -m http.server</code>) rather than opening the HTML file directly.</p>`
    );
  }
  console.error(error);
}
