import {loadData} from "./data.js";
import {CONFIG} from "./config.js";
import {initTheme} from "./theme.js";
import {parseRoute,go} from "./router.js";
import {renderQuestion} from "./render-question.js";
import {loadStudyState,getQuestionState,isDue,resetStudyState} from "./study-state.js";
import {escapeHTML,focusMain} from "./accessibility.js";

const host=document.querySelector("#viewHost");
const search=document.querySelector("#searchInput");
const classFilter=document.querySelector("#classFilter");
const visualFilter=document.querySelector("#visualFilter");
let state=loadStudyState(), data, byId;

initTheme();

function classificationClass(c){return String(c).includes("CONFLICT")?"conflict":String(c).includes("LIMIT")?"limit":"standard"}
function qstate(id){return getQuestionState(state,id)}
function refreshMetrics(){
  if(!data)return;
  const sts=data.questions.map(q=>qstate(q.id));
  document.querySelector("#metricQuestions").textContent=data.questions.length;
  document.querySelector("#metricDue").textContent=sts.filter(isDue).length;
  document.querySelector("#metricStarred").textContent=sts.filter(x=>x.starred).length;
  document.querySelector("#metricStudied").textContent=sts.filter(x=>x.lastReviewed).length;
}
function filtered(){
  const n=search.value.trim().toLowerCase(), c=classFilter.value, v=visualFilter.value;
  return data.questions.filter(q=>{
    if(c && q.classification!==c)return false;
    if(v && q.visual?.type!==v)return false;
    if(n && !`${q.id} ${q.question} ${q.student_view}`.toLowerCase().includes(n))return false;
    return true;
  });
}
function card(q){
  const qs=qstate(q.id);
  return `<button class="question-list-card" data-open="${q.id}" type="button">
    <div class="card-top"><code>${q.id}</code><span class="badge ${classificationClass(q.classification)}">${escapeHTML(q.classification)}</span></div>
    <div class="card-title">${escapeHTML(q.question)}</div>
    <div class="card-meta">${escapeHTML(q.visual?.title||"Study figure")} · ${qs.starred?"★ Starred · ":""}${qs.lastReviewed?`confidence ${qs.confidence}/3`:"not reviewed"}</div>
  </button>`;
}
function renderLibrary(){
  const rows=filtered();
  document.querySelector("#resultCount").textContent=`${rows.length} of ${data.questions.length} questions`;
  host.innerHTML=rows.length?`<div class="library-grid">${rows.map(card).join("")}</div>`:`<div class="empty-card">No questions match these filters.</div>`;
  host.querySelectorAll("[data-open]").forEach(x=>x.addEventListener("click",()=>go(`q/${x.dataset.open}`)));
}
function renderReview(){
  const due=data.questions.filter(q=>isDue(qstate(q.id)));
  const starred=data.questions.filter(q=>qstate(q.id).starred && !due.includes(q));
  document.querySelector("#resultCount").textContent=`${due.length} due · ${starred.length} additional starred`;
  host.innerHTML=`<div class="panel-card"><h1>Review queue</h1><p>Local-only retrieval queue. No browser study state is written to the academic corpus.</p></div><br>`+
    (due.length?`<h2>Due now</h2><div class="library-grid">${due.map(card).join("")}</div>`:`<div class="empty-card">Nothing is due yet. Study a question and rate recall to start the queue.</div>`)+
    (starred.length?`<h2>Starred</h2><div class="library-grid">${starred.map(card).join("")}</div>`:"");
  host.querySelectorAll("[data-open]").forEach(x=>x.addEventListener("click",()=>go(`q/${x.dataset.open}`)));
}
function renderMap(){
  const groups=new Map();
  data.questions.forEach(q=>{const k=q.visual?.type||"concept-map"; if(!groups.has(k))groups.set(k,[]);groups.get(k).push(q)});
  document.querySelector("#resultCount").textContent=`${groups.size} study clusters · 179 questions`;
  host.innerHTML=`<div class="panel-card"><h1>Study map</h1><p>Method-family navigation generated from governed wording. This is a learning/navigation overlay, not source provenance or a prerequisite claim.</p></div><br><div class="map-grid">${[...groups].sort().map(([k,qs])=>`<section class="map-cluster"><strong>${escapeHTML(k.replaceAll("-"," "))}</strong><span class="card-meta">${qs.length} questions</span><div class="mini-links">${qs.slice(0,20).map(q=>`<button data-open="${q.id}" type="button">${q.id.replace("NMA-Q-","Q")}</button>`).join("")}${qs.length>20?`<small>+${qs.length-20} more</small>`:""}</div></section>`).join("")}</div>`;
  host.querySelectorAll("[data-open]").forEach(x=>x.addEventListener("click",()=>go(`q/${x.dataset.open}`)));
}
function syncNav(view){
  document.querySelectorAll(".nav-button").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
}
function renderRoute(){
  const r=parseRoute(); syncNav(r.view==="question"?"library":r.view);
  document.querySelector("#dashboard").hidden=r.view==="question";
  if(r.view==="question"){
    const q=byId.get(r.id);
    if(!q){host.innerHTML=`<div class="empty-card">Unknown question ID.</div>`;return}
    document.querySelector("#resultCount").textContent=q.id;
    renderQuestion(host,q,{state,byId,refreshMetrics}); focusMain();
  }else if(r.view==="review") renderReview();
  else if(r.view==="map") renderMap();
  else renderLibrary();
}

document.querySelectorAll(".nav-button").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view==="library"?"":b.dataset.view)));
[search,classFilter,visualFilter].forEach(x=>x.addEventListener("input",()=>{if(parseRoute().view==="library")renderLibrary()}));
window.addEventListener("hashchange",renderRoute);
document.querySelector("#clearLocal").addEventListener("click",()=>{
  if(confirm("Reset starred/review/confidence state stored only in this browser?")){state=resetStudyState();refreshMetrics();renderRoute()}
});

try{
  data=await loadData(); byId=new Map(data.questions.map(q=>[q.id,q]));
  const visualTypes=[...new Set(data.questions.map(q=>q.visual?.type).filter(Boolean))].sort();
  visualFilter.insertAdjacentHTML("beforeend",visualTypes.map(x=>`<option value="${x}">${escapeHTML(x.replaceAll("-"," "))}</option>`).join(""));
  refreshMetrics();renderRoute();
  if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
}catch(e){
  console.error(e);host.innerHTML=`<div class="empty-card"><h1>Study data failed to load</h1><p>${escapeHTML(e.message)}</p></div>`;
}
