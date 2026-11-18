/* VexApp store edition, web copy: works offline after the first visit. Bump CACHE on every upload. */
const CACHE='vexapp-store-v2';
const SHELL=['./','index.html','manifest.webmanifest','fonts/fonts.css','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.endsWith('/visits.json')) return;  // the counter address is always fetched fresh
  if(e.request.mode==='navigate'||u.pathname.endsWith('index.html')){
    e.respondWith(fetch(e.request).then(r=>{if(r.ok&&r.type==='basic'){const c=r.clone(); const home=/\/(index\.html)?$/.test(u.pathname); caches.open(CACHE).then(x=>x.put(home?'index.html':e.request,c))} return r}).catch(()=>caches.match(e.request).then(h=>h||caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok&&r.type==='basic'){const c=r.clone(); caches.open(CACHE).then(x=>x.put(e.request,c))} return r})));
});
