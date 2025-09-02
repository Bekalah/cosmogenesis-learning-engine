(()=>{ "use strict";
function renderWorkbench(artifact){
  const viewer=document.getElementById("doc-viewer");
  const prov=document.getElementById("provenance-card");
  if(!artifact){
    if(viewer) viewer.src="";
    if(prov) prov.textContent="";
    return;
  }
  const g=(window._grimoires||{})[artifact.primary_text_id];
  if(!g){
    if(viewer) viewer.src="";
    if(prov) prov.innerHTML="Missing grimoire entry.";
    return;
  }
  if(g.missing){
    if(viewer) viewer.src="";
    if(prov) prov.innerHTML="Missing Source";
    return;
  }
  if(viewer) viewer.src=g.path;
  if(window.noteQuestStep) window.noteQuestStep("read",g.id);
  if(g.id==="ars_notoria") localStorage.setItem("memory_awake","true");
  const p=(window._provenance||{})[g.provenance_id]||{};
  const safe=s=>String(s||"");
  let inner=`<h3>${safe(g.title)}</h3><p><strong>Author:</strong> ${safe(g.author)}</p><p><strong>Summary:</strong> ${safe(g.summary)}</p><p><strong>License:</strong> ${safe(p.license)}</p><p><a href="${safe(g.path)}" download>Download Source</a></p>`;
  const startable=(window._quests?Object.values(window._quests).find(q=>q.steps[0]?.action==="read"&&q.steps[0].text_id===g.id&&!localStorage.getItem("quest_"+q.id+"_started")):null);
  if(startable){
    inner+=`<button id="btnStartQuest" aria-label="Start quest">Start Quest</button>`;
  }
  const marks=(window.listEarnedMarks?window.listEarnedMarks():[]);
  if(marks.length){
    inner+=`<p>Mark Earned: ${marks.join(", ")}</p>`;
  }
  // correspondence tablet
  if(artifact.id==="correspondence_tablet"){
    inner+=`<button id="btnCorr" aria-label="Open correspondence table">Correspondence Tablet</button><div id="corrOut"></div>`;
  }
  // Figure of Memory overlay
  if(artifact.id==="ars_notae_figure"&&viewer){
    const svg=`<svg viewBox="0 0 200 200" width="200" height="200" aria-label="Concentric prayer-notae labeled for rapid learning, invoking divine names around a central intent.">
      <circle cx="100" cy="100" r="90" stroke="gold" fill="none"/>
      <circle cx="100" cy="100" r="60" stroke="purple" fill="none"/>
      <circle cx="100" cy="100" r="30" stroke="indigo" fill="none"/>
      <text x="100" y="100" text-anchor="middle" fill="white" font-size="10">Notae</text>
    </svg>`;
    inner+=svg;
  }
  if(prov) prov.innerHTML=inner;
  if(startable){
    prov.querySelector("#btnStartQuest").addEventListener("click",()=>startQuest(startable.id));
  }
  if(artifact.id==="correspondence_tablet"){
    prov.querySelector("#btnCorr").addEventListener("click",renderCorrespondences);
  }
}
function renderCorrespondences(){
  const data=[
    {letter:"Aleph",path:"11",trump:"The Fool",planet:"Air",zodiac:"Aries",stone:"Diamond",perfume:"Amber"},
    {letter:"Beth",path:"12",trump:"The Magician",planet:"Mercury",zodiac:"Taurus",stone:"Jade",perfume:"Musk"},
    {letter:"Gimel",path:"13",trump:"The High Priestess",planet:"Moon",zodiac:"Gemini",stone:"Pearl",perfume:"Sandalwood"}
  ];
  const out=document.getElementById("corrOut");
  if(!out) return;
  out.innerHTML=`<label>Filter <input id="corrFilter" aria-label="Filter correspondences"/></label><div id="corrCols"></div><table id="corrTable"><thead><tr><th data-col="letter">Letter</th><th data-col="path">Path</th><th data-col="trump">Tarot Trump</th><th data-col="planet">Planet</th><th data-col="zodiac">Zodiac</th><th data-col="stone">Stone</th><th data-col="perfume">Perfume</th></tr></thead><tbody></tbody></table>`;
  const tbody=out.querySelector("tbody");
  const filterInp=out.querySelector("#corrFilter");
  const cols=out.querySelectorAll("th");
  cols.forEach(th=>{
    const col=th.dataset.col;
    const cb=document.createElement("label");
    cb.innerHTML=`<input type="checkbox" checked data-col="${col}" aria-label="Toggle ${col}">${col}`;
    out.querySelector("#corrCols").appendChild(cb);
    cb.querySelector("input").addEventListener("change",e=>{
      const show=e.target.checked;
      [...out.querySelectorAll(`[data-col="${col}"]`)].forEach(el=>{
        el.style.display=show?"":"none";
      });
    });
  });
  function render(){
    const f=filterInp.value.toLowerCase();
    tbody.innerHTML="";
    data.filter(row=>row.letter.toLowerCase().includes(f)).forEach(row=>{
      const tr=document.createElement("tr");
      Object.keys(row).forEach(k=>{
        const td=document.createElement("td");
        td.textContent=row[k];
        td.setAttribute("data-col",k);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
  filterInp.addEventListener("input",render);
  render();
}
window.renderWorkbench=renderWorkbench;
})();
