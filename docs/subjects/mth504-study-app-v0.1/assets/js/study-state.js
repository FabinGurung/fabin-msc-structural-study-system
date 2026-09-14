import {CONFIG} from "./config.js";

function fresh(){ return {questions:{}, updatedAt:null}; }
export function loadStudyState(){
  try{return {...fresh(), ...JSON.parse(localStorage.getItem(CONFIG.localStateKey)||"{}")} }
  catch{return fresh()}
}
export function saveStudyState(state){
  state.updatedAt=new Date().toISOString();
  localStorage.setItem(CONFIG.localStateKey, JSON.stringify(state));
}
export function getQuestionState(state,id){
  return state.questions[id] || {starred:false, reviews:[], confidence:null, lastReviewed:null, due:null};
}
export function toggleStar(state,id){
  const q={...getQuestionState(state,id)}; q.starred=!q.starred; state.questions[id]=q; saveStudyState(state); return q;
}
const intervals=[0,1,3,7];
export function rateRecall(state,id,score){
  const now=new Date(); const due=new Date(now);
  due.setDate(due.getDate()+intervals[score]);
  const q={...getQuestionState(state,id)};
  q.confidence=score; q.lastReviewed=now.toISOString(); q.due=due.toISOString();
  q.reviews=[...(q.reviews||[]),{at:now.toISOString(),score,due:q.due}].slice(-50);
  state.questions[id]=q; saveStudyState(state); return q;
}
export function isDue(qs){
  if(!qs.lastReviewed) return false;
  return !qs.due || new Date(qs.due) <= new Date();
}
export function resetStudyState(){ localStorage.removeItem(CONFIG.localStateKey); return fresh(); }
