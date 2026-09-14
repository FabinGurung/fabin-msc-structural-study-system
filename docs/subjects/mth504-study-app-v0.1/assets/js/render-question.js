import {escapeHTML} from "./accessibility.js";
import {feedbackUrl} from "./feedback.js";
import {renderVisual} from "./visualizations.js";
import {getQuestionState,toggleStar,rateRecall} from "./study-state.js";
import {go} from "./router.js";

const HEADING = /^[A-Z0-9][A-Z0-9 /&()–—:+\-]{3,}$/;
const equationish = s => /[=≈≠≤≥∫Σ∂√]|(^|\s)[A-Za-z][_'0-9]*\s*[+\-*/^]=?/.test(s) && s.length < 180;
const cls = c => String(c||"").includes("CONFLICT")?"conflict":String(c||"").includes("LIMIT")?"limit":"standard";

export function parseStudentView(text){
  const lines=String(text||"").replace(/\r/g,"").split("\n");
  const sections=[]; let current={title:"Worked solution",lines:[]};
  for(const raw of lines){
    const line=raw.trim();
    if(line && HEADING.test(line) && line.length<90){
      if(current.lines.some(x=>x.trim())) sections.push(current);
      current={title:line,lines:[]};
    } else current.lines.push(raw);
  }
  if(current.lines.some(x=>x.trim())) sections.push(current);
  return sections;
}
function paragraphize(lines){
  const out=[]; let para=[];
  const flush=()=>{if(para.length){out.push(`<p>${escapeHTML(para.join(" "))}</p>`);para=[]}};
  for(const raw of lines){
    const line=raw.trim();
    if(!line){flush();continue}
    if(equationish(line)){flush();out.push(`<span class="equation-line">${escapeHTML(line)}</span>`);continue}
    const m=line.match(/^(\d+)\.\s+(.+)/);
    if(m){flush();out.push(`<div class="step-line"><strong>${m[1]}.</strong> ${escapeHTML(m[2])}</div>`);continue}
    para.push(line);
  }
  flush(); return out.join("");
}
function sectionHTML(s){
  const title=s.title;
  let tone="";
  if(/WHY/.test(title)) tone="why";
  else if(/CHECK|VERIFY|VALIDATION/.test(title)) tone="check";
  else if(/COMMON MISTAKE|WARNING|CAUTION/.test(title)) tone="warn";
  else if(/EXAM/.test(title)) tone="exam";
  const content=paragraphize(s.lines);
  if(tone) return `<div class="callout ${tone}"><strong>${escapeHTML(title)}</strong><div class="answer-text">${content}</div></div>`;
  return `<section class="section-block"><h2>${escapeHTML(title)}</h2><div class="answer-text">${content}</div></section>`;
}
function conceptTokens(q){
  const text=(q.question+" "+q.student_view).toLowerCase();
  const terms=[
    "bisection","newton","secant","interpolation","lagrange","spline","simpson","trapezoidal",
    "romberg","gauss elimination","lu decomposition","jacobi","gauss-seidel","eigenvalue",
    "runge-kutta","euler","predictor-corrector","finite difference","pde","ode","error","convergence"
  ];
  return terms.filter(t=>text.includes(t)).slice(0,8);
}
function auditTable(q){
  const rows=[
    ["Permanent ID",q.id],["Classification",q.classification],["Occurrence",q.occurrence||"—"],
    ["Active enrichment batch",q.batch],["Question wording source",q.question_source||"—"],
    ["Source-lock state",q.source_lock||"—"],["Schema mode",q.schema_mode||"—"],
    ["Workflow document",q.document_name||"—"]
  ];
  return `<p>This panel contains provenance/workflow detail and is intentionally separated from the default Study View.</p><table class="audit-table">${rows.map(([a,b])=>`<tr><th>${escapeHTML(a)}</th><td>${escapeHTML(b)}</td></tr>`).join("")}</table>`;
}
function examSection(sections){
  const x=sections.find(s=>/EXAM/.test(s.title));
  return x?`<div class="callout exam"><strong>Exam-ready answer</strong><div class="answer-text">${paragraphize(x.lines)}</div></div>`:`<div class="empty-card">No separately labelled exam-answer block is present in this enrichment record yet. Use the governed worked answer and report this as a beta UX gap.</div>`;
}
function workedSections(sections){
  return sections.filter(s=>!/SOURCE ALIGNMENT|AUDIT|EXAM/.test(s.title)).map(sectionHTML).join("");
}
function sourceSection(sections){
  const x=sections.find(s=>/SOURCE ALIGNMENT|AUDIT/.test(s.title));
  return x?sectionHTML(x):"";
}
function relatedHTML(q, questionsById){
  if(!q.related?.length) return `<p class="card-meta">No heuristic related-question links yet.</p>`;
  return `<div class="related-list">${q.related.map(r=>{
    const other=questionsById.get(r.id);
    return other?`<a class="related-link" href="#q/${r.id}"><span><code>${r.id}</code> · ${escapeHTML(other.question)}</span><small>${Math.round(r.score*100)}%</small></a>`:"";
  }).join("")}</div><p class="card-meta">Navigation similarity only; not an academic prerequisite/provenance claim.</p>`;
}

export function renderQuestion(host,q,ctx){
  const tpl=document.querySelector("#questionTemplate");
  const node=tpl.content.cloneNode(true);
  const sections=parseStudentView(q.student_view);
  const qs=getQuestionState(ctx.state,q.id);
  const byId=ctx.byId;

  node.querySelector(".qid").textContent=q.id;
  node.querySelector(".question-title").textContent=q.question;
  const badge=node.querySelector(".classification"); badge.textContent=q.classification; badge.classList.add(cls(q.classification));
  node.querySelector(".study-state").textContent=qs.lastReviewed?`Reviewed · confidence ${qs.confidence}/3`:"Not reviewed locally";
  const star=node.querySelector(".star-button"); star.textContent=qs.starred?"★ Starred":"☆ Star";

  if(q.classification!=="STANDARD"){
    const w=node.querySelector(".source-warning"); w.hidden=false;
    w.innerHTML=`<strong>${escapeHTML(q.classification)}</strong> · This record has a preserved source boundary. Study the conditional/known material, but do not treat missing or conflicting data as source-given.`;
  }

  const concepts=conceptTokens(q);
  node.querySelector('[data-panel="study"]').innerHTML=`
    <div class="study-intro">
      <div>
        <div class="callout why"><strong>What are you trying to do?</strong><div>${escapeHTML(q.question)}</div></div>
        <h2>Concept anchors</h2>
        <div>${(concepts.length?concepts:["read the method structure","identify the governing formula","check the result"]).map(x=>`<span class="term-chip">${escapeHTML(x)}</span>`).join("")}</div>
        <h2>Related questions</h2>${relatedHTML(q,byId)}
      </div>
      <aside class="study-route"><strong>Low-load study route</strong><ol><li>Read the question and predict the method.</li><li>Inspect the figure before reading every line.</li><li>Work through the solution and WHY/CHECK callouts.</li><li>Close the answer and retrieve from memory.</li><li>Compare the exam-ready answer and rate confidence.</li></ol><p class="card-meta">Retrieval state is stored only in this browser.</p></aside>
    </div>`;
  node.querySelector('[data-panel="worked"]').innerHTML=workedSections(sections)||`<div class="answer-text">${paragraphize(String(q.student_view).split("\n"))}</div>`;
  node.querySelector('[data-panel="visual"]').innerHTML=renderVisual(q);
  node.querySelector('[data-panel="exam"]').innerHTML=examSection(sections);
  node.querySelector('[data-panel="audit"]').innerHTML=auditTable(q)+sourceSection(sections);

  node.querySelector('[data-panel="recall"]').innerHTML=`
    <div class="recall-cover">
      <h2>Active recall</h2>
      <p>Without looking at the worked solution, write or say the method, central formula/steps, and final check.</p>
      <button class="reveal-button" type="button">Reveal exam answer</button>
      <div class="recall-answer" hidden>${examSection(sections)}</div>
      <h3>How well could you retrieve it?</h3>
      <div class="rating-row">
        <button data-score="0" type="button">0 · Again</button>
        <button data-score="1" type="button">1 · Hard</button>
        <button data-score="2" type="button">2 · Good</button>
        <button data-score="3" type="button">3 · Easy</button>
      </div>
      <p class="card-meta">Simple local review intervals: Again today · Hard +1 day · Good +3 days · Easy +7 days. This is a browser-only study aid, not academic data.</p>
    </div>`;

  host.replaceChildren(node);

  const shell=host.querySelector(".question-shell");
  shell.querySelector(".feedback-button").href=feedbackUrl(q);
  shell.querySelector(".feedback-button").textContent="Report issue";

  shell.querySelectorAll(".study-tabs button").forEach(btn=>btn.addEventListener("click",()=>{
    shell.querySelectorAll(".study-tabs button").forEach(b=>b.classList.toggle("active",b===btn));
    shell.querySelectorAll(".tab-panel").forEach(p=>p.hidden=p.dataset.panel!==btn.dataset.tab);
  }));
  star.addEventListener("click",()=>{
    const x=toggleStar(ctx.state,q.id); star.textContent=x.starred?"★ Starred":"☆ Star"; ctx.refreshMetrics();
  });
  shell.querySelector(".recall-button").addEventListener("click",()=>shell.querySelector('[data-tab="recall"]').click());
  shell.querySelector(".reveal-button").addEventListener("click",e=>{
    const a=shell.querySelector(".recall-answer"); a.hidden=!a.hidden; e.currentTarget.textContent=a.hidden?"Reveal exam answer":"Hide exam answer";
  });
  shell.querySelectorAll("[data-score]").forEach(b=>b.addEventListener("click",()=>{
    rateRecall(ctx.state,q.id,Number(b.dataset.score)); ctx.refreshMetrics();
    shell.querySelector(".study-state").textContent=`Reviewed · confidence ${b.dataset.score}/3`;
  }));
}
