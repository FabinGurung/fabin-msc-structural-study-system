function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
const wrap=(body,label)=>`<svg class="study-figure" viewBox="0 0 760 320" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

function flow(labels){
  const xs=[85,270,470,675];
  return labels.map((x,i)=>`<rect class="${i%2?"box2":"box"}" x="${xs[i]-65}" y="125" width="130" height="70" rx="14"/><text x="${xs[i]}" y="155" text-anchor="middle" font-size="14">${esc(x)}</text>${i<labels.length-1?`<path class="primary" d="M${xs[i]+67} 160 L${xs[i+1]-67} 160"/><path d="M${xs[i+1]-75} 153 l12 7 -12 7" fill="var(--blue)"/>`:""}`).join("");
}
function axes(){return `<line class="axis" x1="80" y1="260" x2="700" y2="260"/><line class="axis" x1="80" y1="260" x2="80" y2="50"/>`; }

export function renderVisual(q){
  const v=q.visual||{type:"concept-map",title:"Concept relationship map",description:""};
  let body="";
  switch(v.type){
    case "root-finding":
      body=axes()+`<path class="primary" d="M95 85 C190 280 300 80 390 170 S560 250 690 70"/><line class="secondary" x1="80" y1="170" x2="700" y2="170"/><circle class="node" cx="390" cy="170" r="9"/><circle class="warn-node" cx="245" cy="170" r="8"/><circle class="warn-node" cx="530" cy="170" r="8"/><text x="400" y="150">candidate root</text><text x="180" y="295">bracket / iterate → reduce error → check</text>`;
      break;
    case "interpolation":
      body=axes()+`<path class="primary" d="M100 230 C180 85 280 245 390 120 S590 230 690 95"/>`+[150,270,410,560,660].map((x,i)=>`<circle class="node" cx="${x}" cy="${[165,185,110,170,105][i]}" r="8"/>`).join("")+`<line class="secondary" x1="470" y1="60" x2="470" y2="260"/><text x="480" y="82">target x</text>`;
      break;
    case "integration":
      body=axes()+`<path class="primary" d="M100 215 C190 60 310 100 390 155 S560 115 690 80"/>`+[130,230,330,430,530,630].map((x,i)=>`<line class="gridline" x1="${x}" y1="260" x2="${x}" y2="${[183,103,119,168,132,93][i]}"/>`).join("")+`<text x="270" y="296">nodes / panels approximate the area</text>`;
      break;
    case "differentiation":
      body=`<line class="axis" x1="90" y1="180" x2="690" y2="180"/>`+[180,300,420,540].map((x,i)=>`<circle class="${i===2?"node":"warn-node"}" cx="${x}" cy="180" r="10"/><text x="${x}" y="215" text-anchor="middle">${["x−h","x","x+h","x+2h"][i]}</text>`).join("")+`<path class="primary" d="M300 110 Q420 60 540 110"/><text x="420" y="75" text-anchor="middle">sample neighborhood → derivative estimate</text>`;
      break;
    case "linear-system":
      body=flow(["matrix / equations","pivot or iterate","updated x","residual check"]);
      break;
    case "eigen":
      body=flow(["trial vector","A·x","normalize","λ / vector check"]);
      break;
    case "ode":
      body=axes()+`<path class="secondary" d="M105 220 C220 160 350 190 480 105 S620 90 690 70"/>`+[150,270,390,510,630].map((x,i)=>`<circle class="node" cx="${x}" cy="${[195,180,145,100,80][i]}" r="8"/>`).join("")+`<path class="primary" d="M150 195 L270 180 L390 145 L510 100 L630 80"/><text x="300" y="295">state → slope/stages → next state → global check</text>`;
      break;
    case "pde":
      body=[0,1,2,3,4].map(i=>[0,1,2,3,4,5,6].map(j=>`<circle class="${i===2&&j===3?"node":"warn-node"}" cx="${130+j*80}" cy="${70+i*48}" r="${i===2&&j===3?9:5}"/>`).join("")).join("")+`<line class="primary" x1="370" y1="166" x2="290" y2="166"/><line class="primary" x1="370" y1="166" x2="450" y2="166"/><line class="primary" x1="370" y1="166" x2="370" y2="118"/><line class="primary" x1="370" y1="166" x2="370" y2="214"/><text x="370" y="290" text-anchor="middle">mesh + local stencil → field update</text>`;
      break;
    case "error-analysis":
      body=`<line class="axis" x1="110" y1="180" x2="670" y2="180"/><circle class="node" cx="510" cy="180" r="10"/><circle class="warn-node" cx="430" cy="180" r="10"/><path class="primary" d="M430 130 L510 130"/><text x="470" y="115" text-anchor="middle">|T−A|</text><text x="430" y="215" text-anchor="middle">approx.</text><text x="510" y="215" text-anchor="middle">reference</text><text x="390" y="285">absolute → relative → percentage / tolerance</text>`;
      break;
    case "curve-fitting":
      body=axes()+[140,220,300,380,460,540,620].map((x,i)=>`<circle class="warn-node" cx="${x}" cy="${[210,175,190,130,150,95,105][i]}" r="7"/>`).join("")+`<path class="primary" d="M110 230 C260 190 420 135 680 75"/><text x="380" y="295">data → fitted model → residuals</text>`;
      break;
    default:
      body=flow(["question","key idea","mathematical action","check / exam"]);
  }
  return `<div class="visual-card"><h2>${esc(v.title)}</h2>${wrap(body,v.description||v.title)}<p class="visual-caption"><strong>Study figure.</strong> ${esc(v.description)} ${v.quantitative?"Uses governed question-specific numeric metadata.":"This is a structural schematic derived from the governed wording, not a source-provided quantitative plot."}</p></div>`;
}
