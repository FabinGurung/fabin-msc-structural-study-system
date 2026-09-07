export function parseRoute(){
  const h=location.hash.replace(/^#/,"");
  if(h.startsWith("q/")) return {view:"question",id:h.slice(2)};
  if(h==="review") return {view:"review"};
  if(h==="map") return {view:"map"};
  return {view:"library"};
}
export function go(route){
  location.hash=route==="library"?"":route;
}
