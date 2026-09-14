const CACHE="mth504-study-shell-v0.1";
const CORE=["./","./index.html","./manifest.webmanifest","./data/enrichment.json","./data/visual-models.json","./data/study-links.json",
"./assets/css/tokens.css","./assets/css/base.css","./assets/css/layout.css","./assets/css/components.css","./assets/css/study.css",
"./assets/js/app.js","./assets/js/config.js","./assets/js/data.js","./assets/js/router.js","./assets/js/render-question.js",
"./assets/js/study-state.js","./assets/js/visualizations.js","./assets/js/theme.js","./assets/js/feedback.js","./assets/js/accessibility.js"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
    const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;
  })));
});
