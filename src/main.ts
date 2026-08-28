import "./style.css";
import { App } from "./app";
import { captureReturnedLicense } from "./license";

captureReturnedLicense();

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("App mount point is missing");

const app = new App(root);
app.start().catch((error: unknown) => {
  console.error(error);
  root.innerHTML = `
    <main id="main" class="fatal">
      <p class="eyebrow">LOCAL WORKSPACE ERROR</p>
      <h1>Your timecard could not be opened</h1>
      <p>The browser blocked local storage. Check private browsing or storage settings, then reload.</p>
      <button type="button" onclick="location.reload()">Reload the app</button>
    </main>`;
});
