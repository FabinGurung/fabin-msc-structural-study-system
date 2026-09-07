export function announce(message){
  const host=document.querySelector("#viewHost");
  host.setAttribute("aria-label",message);
  setTimeout(()=>host.removeAttribute("aria-label"),700);
}
export function focusMain(){
  const main=document.querySelector("#main");
  main.focus({preventScroll:true});
}
export function escapeHTML(v){
  return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
