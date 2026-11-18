/* getvexapp.com visitor count. Adds 1 to today's tally on the owner's PC, once per browser per day.
   It sends an empty request: no cookies, no ids, no page names, no device details. The "already counted today"
   mark stays in this browser only. Runs on the website only, never inside the phone apps. */
(function(){
  if(!/(^|\.)getvexapp\.com$/.test(location.hostname)) return;
  var d=new Date(), day=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(), K='vexCounted';
  try{ if(localStorage.getItem(K)===day) return; }catch(e){}
  fetch('visits.json',{cache:'no-store'}).then(function(r){ return r.ok?r.json():null; }).then(function(c){
    if(!c||!/^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/.test(c.url)) return;
    return fetch(c.url+'/v',{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',keepalive:true}).then(function(r){
      if(r.ok){ try{ localStorage.setItem(K,day); }catch(e){} }
    });
  }).catch(function(){});
})();
