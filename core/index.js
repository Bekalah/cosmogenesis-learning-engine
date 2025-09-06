import {loadRegistry} from "../engines/registry-loader.js";
import {loadFromRepo} from "../engines/cross-fetch.js";
import {validateInterface} from "../engines/interface-guard.js";
import {composeView} from "../engines/merge-view.js";
import {Safety} from "../ui/safety.js";

const statusEl = document.getElementById("status");
const motionSel = document.getElementById("motion");
const autoChk = document.getElementById("autoplay");
const contrastSel = document.getElementById("contrast");

function applySafety(){
  Safety.state.motion = motionSel.value;
  Safety.state.autoplay = autoChk.checked;
  Safety.state.contrast = contrastSel.value;
  Safety.apply();
}

[motionSel, autoChk, contrastSel].forEach(el=>el.addEventListener("input", applySafety));
applySafety();

async function boot(){
  try{
    const registry = await loadRegistry();
    const codexNodes = await loadFromRepo(registry, "cosmogenesis-learning-engine", "assets/data/codex144.json").catch(()=>[]);
    const shared = {version:"1.0.0", palettes:[], geometry_layers:[], narrative_nodes:[...codexNodes]};
    const guard = await validateInterface(shared);
    if(!guard.valid){ console.warn("Interface warnings:", guard.errors); }
    const view = composeView(shared, {});
    window.__CATHEDRAL_VIEW__ = view;
    statusEl.textContent = "ready";
  }catch(e){
    console.warn(e);
    statusEl.textContent = "failed";
  }
}
boot();
