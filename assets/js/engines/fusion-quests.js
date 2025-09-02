(()=>{ “use strict”; let questsIndex={}; function safeFetchJSON(path){ return fetch(path,{cache:“no-store”}).then(r=>r.json()); } async function loadQuests(){ const data=await safeFetchJSON(”/assets/data/fusion/quests.json”); questsIndex=Object.fromEntries((data.quests||[]).map(q=>[q.id,q])); } function startQuest(id){ const q=questsIndex[id]; if(!q) return alert(“Quest not found.”); alert(“Quest started: “+q.title); } document.addEventListener(“DOMContentLoaded”,loadQuests); window.startQuest=startQuest; })();
(()=>{ "use strict";
let questsIndex={};
function safeFetchJSON(path){ return fetch(path,{cache:"no-store"}).then(r=>r.json()); }
async function loadQuests(){
  const data=await safeFetchJSON("/assets/data/fusion/quests.json");
  questsIndex=Object.fromEntries((data.quests||[]).map(q=>[q.id,q]));
  window._quests=questsIndex;
}
function startQuest(id){
  const q=questsIndex[id];
  if(!q) return alert("Quest not found.");
  localStorage.setItem("quest_"+id+"_started","true");
  alert("Quest started: "+q.title);
}
function noteStep(action, identifier){
  Object.values(questsIndex).forEach(q=>{
    (q.steps||[]).forEach(step=>{
      if(step.action===action && ((action==="read"&&step.text_id===identifier)||(action==="loot"&&step.artifact_id===identifier))){
        localStorage.setItem("quest_"+q.id+"_"+step.id,"done");
      }
    });
    const done=q.steps.every(st=>localStorage.getItem("quest_"+q.id+"_"+st.id)==="done");
    if(done) localStorage.setItem("quest_"+q.id+"_done","true");
  });
  if(window.checkMarks){
    const marks=window.checkMarks();
    localStorage.setItem("marks",JSON.stringify(marks));
  }
}
function getMarks(){ try{return JSON.parse(localStorage.getItem("marks")||"[]");}catch(e){return [];} }
document.addEventListener("DOMContentLoaded",loadQuests);
window.startQuest=startQuest;
window.noteQuestStep=noteStep;
window.listEarnedMarks=getMarks;
})();
