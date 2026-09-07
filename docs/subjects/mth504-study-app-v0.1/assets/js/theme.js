import {CONFIG} from "./config.js";
const html=document.documentElement;
export function initTheme(){
  let theme=localStorage.getItem(CONFIG.themeKey);
  if(!theme) theme="light";
  html.dataset.theme=theme;
  html.dataset.semanticColor=localStorage.getItem("mth504-semantic-color")||"on";
  html.dataset.contrast=localStorage.getItem("mth504-contrast")||"normal";
  document.querySelector("#themeToggle").addEventListener("click",()=>{
    const next=html.dataset.theme==="light"?"dark":"light"; html.dataset.theme=next; localStorage.setItem(CONFIG.themeKey,next);
  });
  document.querySelector("#colorToggle").addEventListener("click",()=>{
    const next=html.dataset.semanticColor==="off"?"on":"off"; html.dataset.semanticColor=next; localStorage.setItem("mth504-semantic-color",next);
  });
  document.querySelector("#contrastToggle").addEventListener("click",()=>{
    const next=html.dataset.contrast==="high"?"normal":"high"; html.dataset.contrast=next; localStorage.setItem("mth504-contrast",next);
  });
}
