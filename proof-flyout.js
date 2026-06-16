/**
 * Recent-jobs proof flyout — an edge tab that expands a mini map + recent
 * job cards (from /recent-work.json), plus a 3/4-height bottom overlay that
 * loads the full /recent-projects experience inline (no page navigation).
 * Also makes the homepage Google-reviews carousel open that same overlay.
 * Self-contained, namespaced .pfly-*. Embed: <script src="/proof-flyout.js" async></script>
 */
(function () {
  var MAPS_KEY = 'AIzaSyBvvwXnVB5WxLjHG091gU0R-uOBodS8pMM';
  var FEED = '/recent-work.json?max=12';
  var OVERLAY_URL = '/recent-projects';
  var TUCSON = { lat: 32.2226, lng: -110.9747 };
  var items = [], map = null, info = null, markers = {}, loaded = false, mapsLoading = false, ovLoaded = false;

  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  var css = ''
    + '.pfly-tab{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:99998;'
    + 'background:#1a73e8;color:#fff;border:none;cursor:pointer;border-radius:12px 0 0 12px;'
    + 'padding:14px 9px;box-shadow:-2px 2px 12px rgba(0,0,0,.18);display:flex;flex-direction:column;'
    + 'align-items:center;gap:6px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
    + '.pfly-tab span{writing-mode:vertical-rl;transform:rotate(180deg);font-size:12.5px;font-weight:600;letter-spacing:.04em}'
    + '.pfly-tab b{font-size:16px;line-height:1}'
    + '.pfly-panel{position:fixed;right:0;top:0;height:100%;width:390px;max-width:92vw;z-index:99999;'
    + 'background:#fff;box-shadow:-6px 0 24px rgba(0,0,0,.22);transform:translateX(100%);'
    + 'transition:transform .28s ease;display:flex;flex-direction:column;'
    + 'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
    + '.pfly-panel.open{transform:translateX(0)}'
    + '.pfly-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #e3e6ea}'
    + '.pfly-hd h3{margin:0;font-size:15px;color:#1a2330}'
    + '.pfly-x{background:none;border:none;font-size:22px;line-height:1;cursor:pointer;color:#5f6368}'
    + '#pfly-map{width:100%;height:190px;background:#eef1f4;flex:0 0 auto}'
    + '.pfly-list{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}'
    + '.pfly-card{display:flex;gap:10px;border:1px solid #e3e6ea;border-radius:10px;overflow:hidden;cursor:pointer}'
    + '.pfly-card:hover{border-color:#1a73e8;box-shadow:0 3px 12px rgba(26,115,232,.14)}'
    + '.pfly-card img{width:84px;height:84px;object-fit:cover;flex:0 0 84px;background:#eef1f4}'
    + '.pfly-cb{padding:8px 10px;min-width:0}'
    + '.pfly-ct{font-size:13.5px;font-weight:600;margin:0 0 3px;color:#1a2330}'
    + '.pfly-cd{font-size:12px;color:#5f6368;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'
    + '.pfly-ft{padding:12px 16px;border-top:1px solid #e3e6ea;text-align:center}'
    + '.pfly-ft a{color:#1a73e8;font-weight:600;text-decoration:none;font-size:14px;cursor:pointer}'
    + '.pfly-empty{color:#79828d;font-size:13px;text-align:center;padding:24px 0}'
    // 3/4 overlay — slides in from the right; collapse arrow on left-edge center
    + '.pfly-ovbg{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.45);opacity:0;visibility:hidden;transition:opacity .3s}'
    + '.pfly-ovbg.open{opacity:1;visibility:visible}'
    + '.pfly-ov{position:fixed;top:0;right:0;height:100%;width:78%;max-width:1180px;z-index:100001;background:#fff;'
    + 'transform:translateX(105%);transition:transform .34s cubic-bezier(.4,0,.2,1);'
    + 'display:flex;flex-direction:column;box-shadow:-10px 0 34px rgba(0,0,0,.32);'
    + 'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
    + '.pfly-ov.open{transform:translateX(0)}'
    + '.pfly-ovtab{position:absolute;left:-34px;top:50%;transform:translateY(-50%);z-index:2;background:#1a73e8;color:#fff;'
    + 'border:none;cursor:pointer;border-radius:12px 0 0 12px;padding:18px 8px;display:flex;flex-direction:column;'
    + 'align-items:center;gap:8px;box-shadow:-2px 2px 12px rgba(0,0,0,.2)}'
    + '.pfly-ovtab b{font-size:18px;line-height:1}'
    + '.pfly-ovtab span{writing-mode:vertical-rl;transform:rotate(180deg);font-size:11.5px;font-weight:600;letter-spacing:.05em}'
    + '.pfly-ovhd{display:flex;align-items:center;gap:10px;padding:16px 20px;border-bottom:1px solid #e3e6ea;flex:0 0 auto}'
    + '.pfly-ovhd h3{margin:0;font-size:16px;color:#1a2330}'
    + '.pfly-ovframe{flex:1;border:0;width:100%}'
    + '#google-reviews-container{cursor:pointer}'
    + '@media(max-width:760px){.pfly-ov{width:100%;max-width:none}'
    + '.pfly-panel{width:100%;height:82%;top:auto;bottom:0;border-radius:16px 16px 0 0;transform:translateY(100%)}'
    + '.pfly-panel.open{transform:translateY(0)}}';

  function injectCss(){ var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); }

  function build(){
    var tab=document.createElement('button');
    tab.className='pfly-tab'; tab.setAttribute('aria-label','See recent jobs near you');
    tab.innerHTML='<b>◀</b><span>📍 Recent Jobs</span>';
    tab.onclick=open;

    var panel=document.createElement('div');
    panel.className='pfly-panel'; panel.id='pfly-panel';
    panel.innerHTML=''
      +'<div class="pfly-hd"><h3>Recent jobs near you</h3><button class="pfly-x" aria-label="Close">×</button></div>'
      +'<div id="pfly-map"></div>'
      +'<div class="pfly-list" id="pfly-list"><p class="pfly-empty">Loading…</p></div>'
      +'<div class="pfly-ft"><a id="pfly-viewall">View all projects →</a></div>';
    document.body.appendChild(tab);
    document.body.appendChild(panel);
    panel.querySelector('.pfly-x').onclick=close;
    panel.querySelector('#pfly-viewall').onclick=function(e){e.preventDefault();openOverlay();};

    // 3/4 overlay (loads the full projects experience inline)
    var bg=document.createElement('div'); bg.className='pfly-ovbg'; bg.id='pfly-ovbg';
    var ov=document.createElement('div'); ov.className='pfly-ov'; ov.id='pfly-ov';
    ov.innerHTML=''
      +'<button class="pfly-ovtab" id="pfly-ovtab" aria-label="Collapse"><b>▶</b><span>CLOSE</span></button>'
      +'<div class="pfly-ovhd"><h3>Our recent work near you</h3></div>'
      +'<iframe class="pfly-ovframe" id="pfly-ovframe" title="Recent projects" loading="lazy"></iframe>';
    document.body.appendChild(bg);
    document.body.appendChild(ov);
    bg.onclick=closeOverlay;
    ov.querySelector('#pfly-ovtab').onclick=closeOverlay;    // left-edge arrow collapses

    // Make the homepage Google-reviews carousel open the overlay too.
    var rc=document.getElementById('google-reviews-container');
    if(rc) rc.addEventListener('click',function(e){ if(e.target.closest('a'))return; openOverlay(); });
  }

  function openOverlay(){
    var ov=document.getElementById('pfly-ov'), bg=document.getElementById('pfly-ovbg');
    if(!ovLoaded){ document.getElementById('pfly-ovframe').src=OVERLAY_URL; ovLoaded=true; }
    bg.classList.add('open'); ov.classList.add('open'); document.body.style.overflow='hidden';
  }
  function closeOverlay(){
    document.getElementById('pfly-ov').classList.remove('open');
    document.getElementById('pfly-ovbg').classList.remove('open');
    document.body.style.overflow='';
  }

  function open(){
    document.getElementById('pfly-panel').classList.add('open');
    if(!loaded){ loaded=true; loadData(); }
    else if(map){ setTimeout(function(){ google.maps.event.trigger(map,'resize'); fitMap(); },350); }
  }
  function close(){ document.getElementById('pfly-panel').classList.remove('open'); }

  function loadData(){
    fetch(FEED).then(function(r){return r.json();}).then(function(d){
      items=(d&&d.items)||[]; renderCards(); ensureMaps();
    }).catch(function(){ items=[]; renderCards(); });
  }

  function renderCards(){
    var list=document.getElementById('pfly-list');
    if(!items.length){ list.innerHTML='<p class="pfly-empty">Recent projects coming soon.</p>'; return; }
    list.innerHTML=items.map(function(i){
      return '<div class="pfly-card" onclick="__pflyFocus(\''+esc(i.id)+'\')">'
        +(i.image_url?'<img src="'+esc(i.image_url)+'" alt="" loading="lazy">':'')
        +'<div class="pfly-cb"><p class="pfly-ct">'+esc(i.title)+'</p>'
        +'<p class="pfly-cd">'+esc(i.short_description)+'</p></div></div>';
    }).join('');
  }

  function ensureMaps(){
    if(window.google && window.google.maps && window.google.maps.Map){ return initMap(); }
    if(mapsLoading) return;
    mapsLoading=true;
    window.__pflyInitMap=initMap;
    var s=document.createElement('script');
    s.src='https://maps.googleapis.com/maps/api/js?key='+MAPS_KEY+'&loading=async&callback=__pflyInitMap';
    s.async=true; document.head.appendChild(s);
  }

  function fitMap(){
    if(!map) return;
    var b=new google.maps.LatLngBounds(); var n=0;
    items.forEach(function(i){ if(typeof i.approximate_lat==='number'){ b.extend({lat:i.approximate_lat,lng:i.approximate_lng}); n++; } });
    if(n){ map.fitBounds(b); if(n===1) map.setZoom(12); } else { map.setCenter(TUCSON); map.setZoom(10); }
  }

  function initMap(){
    var el=document.getElementById('pfly-map'); if(!el||!window.google) return;
    map=new google.maps.Map(el,{center:TUCSON,zoom:10,mapTypeControl:false,streetViewControl:false,fullscreenControl:false});
    markers={};
    items.forEach(function(i){
      if(typeof i.approximate_lat!=='number') return;
      var m=new google.maps.Marker({position:{lat:i.approximate_lat,lng:i.approximate_lng},map:map,title:i.title});
      m.addListener('click',function(){ showInfo(i,m); });
      markers[i.id]=m;
    });
    // The panel is still sliding in when the map is created — resize once it's
    // settled so tiles paint, then fit to the pins.
    setTimeout(function(){ if(map){ google.maps.event.trigger(map,'resize'); fitMap(); } }, 400);
  }

  function showInfo(i,m){
    if(!info) info=new google.maps.InfoWindow();
    info.setContent('<div style="font-family:system-ui;max-width:220px"><b style="font-size:13px">'+esc(i.title)
      +'</b><p style="font-size:12px;color:#5f6368;margin:4px 0 6px">'+esc(String(i.short_description).slice(0,120))+'…</p>'
      +'<a href="'+esc(i.cta_url)+'" style="color:#1a73e8;font-weight:600;text-decoration:none;font-size:13px">'+esc(i.cta_text)+' →</a></div>');
    info.open(map,m);
  }

  window.__pflyFocus=function(id){
    var m=markers[id]; var i=items.filter(function(x){return x.id===id;})[0];
    if(m&&map){ map.panTo(m.getPosition()); map.setZoom(12); showInfo(i,m); }
  };

  function start(){ injectCss(); build(); }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',start); } else { start(); }
})();
