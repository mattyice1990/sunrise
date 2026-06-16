/**
 * Recent-jobs proof flyout — an edge tab that expands a mini map + recent
 * job cards, fed by /recent-work.json. Self-contained (injects its own CSS,
 * namespaced .pfly-*). Drop onto any page with:
 *   <script src="/proof-flyout.js" async></script>
 * Reuses the site's existing Google Maps key; loads Maps lazily on first open.
 */
(function () {
  var MAPS_KEY = 'AIzaSyBvvwXnVB5WxLjHG091gU0R-uOBodS8pMM';
  var FEED = '/recent-work.json?max=12';
  var TUCSON = { lat: 32.2226, lng: -110.9747 };
  var items = [], map = null, info = null, markers = {}, loaded = false, mapsLoading = false;

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
    + '.pfly-ft a{color:#1a73e8;font-weight:600;text-decoration:none;font-size:14px}'
    + '.pfly-empty{color:#79828d;font-size:13px;text-align:center;padding:24px 0}'
    + '@media(max-width:560px){.pfly-panel{width:100%;height:82%;top:auto;bottom:0;border-radius:16px 16px 0 0;transform:translateY(100%)}'
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
      +'<div class="pfly-ft"><a href="/recent-projects">View all projects →</a></div>';
    document.body.appendChild(tab);
    document.body.appendChild(panel);
    panel.querySelector('.pfly-x').onclick=close;
  }

  function open(){
    document.getElementById('pfly-panel').classList.add('open');
    if(!loaded){ loaded=true; loadData(); }
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

  function initMap(){
    var el=document.getElementById('pfly-map'); if(!el||!window.google) return;
    map=new google.maps.Map(el,{center:TUCSON,zoom:10,mapTypeControl:false,streetViewControl:false,fullscreenControl:false});
    var bounds=new google.maps.LatLngBounds(); markers={};
    items.forEach(function(i){
      if(typeof i.approximate_lat!=='number') return;
      var pos={lat:i.approximate_lat,lng:i.approximate_lng};
      var m=new google.maps.Marker({position:pos,map:map,title:i.title});
      m.addListener('click',function(){ showInfo(i,m); });
      markers[i.id]=m; bounds.extend(pos);
    });
    if(Object.keys(markers).length){ map.fitBounds(bounds); if(items.length===1) map.setZoom(12); }
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
