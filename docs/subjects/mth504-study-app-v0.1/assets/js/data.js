import {CONFIG} from "./config.js";

async function getJSON(url){
  const r = await fetch(url, {cache:"no-cache"});
  if(!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return r.json();
}
export async function loadData(){
  const [corpus, visuals, links] = await Promise.all([
    getJSON(CONFIG.corpusPath), getJSON(CONFIG.visualPath), getJSON(CONFIG.linksPath)
  ]);
  if(corpus.question_count !== CONFIG.academicIdentityCount || corpus.questions.length !== CONFIG.academicIdentityCount){
    throw new Error(`Corpus invariant failed: ${corpus.questions.length}`);
  }
  const visualMap = new Map(visuals.questions.map(x=>[x.id,x]));
  const linkMap = new Map(links.questions.map(x=>[x.id,x.related||[]]));
  const questions = corpus.questions.map(q=>({...q, visual:visualMap.get(q.id), related:linkMap.get(q.id)||[]}));
  return {corpus, visuals, links, questions};
}
