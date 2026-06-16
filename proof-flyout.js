/**
 * Recent-jobs proof flyout.
 *  - Edge tab on the right.
 *  - HOVER the tab -> a compact map-preview peeks out (~a quarter), teasing it.
 *  - CLICK the tab/preview (or a homepage review) -> the full 3/4 "all projects"
 *    overlay slides in from the right (loads /recent-projects inline).
 *  - The overlay's left-edge arrow (or the dimmed backdrop) collapses it; the
 *    preview closes too.
 * Self-contained, namespaced .pfly-*. Embed: <script src="/proof-flyout.js" async></script>
 */
(function () {
  var MAPS_KEY = 'AIzaSyBvvwXnVB5WxLjHG091gU0R-uOBodS8pMM';
  var FEED = '/recent-work.json?max=12';
  var OVERLAY_URL = '/recent-projects';
  var TUCSON = { lat: 32.2226, lng: -110.9747 };
  var items = [], map = null, info = null, markers = {}, dataLoaded = false, mapsLoading = false, ovLoaded = false, peekTimer = null;

  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  var css = ''
    + '.pfly-tab{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:99998;'
    + 'background:#1a73e8;color:#fff;border:none;cursor:pointer;border-radius:12px 0 0 12px;'
    + 'padding:14px 9px;box-shadow:-2px 2px 12px rgba(0,0,0,.18);display:flex;flex-direction:column;'
    + 'align-items:center;gap:6px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
    + '.pfly-tab span{writing-mode:vertical-rl;transform:rotate(180deg);font-size:12.5px;font-weight:600;letter-spacing:.04em}'
    + '.pfly-tab b{font-size:16px;line-height:1}'
    // hover map preview (slides via right; ~25% peeks)
    + '.pfly-peek{position:fixed;top:50%;margin-top:-150px;right:-360px;width:360px;height:300px;z-index:99997;'
    + 'background:#fff;border-radius:14px 0 0 14px;overflow:hidden;box-shadow:-6px 4px 22px rgba(0,0,0,.22);'
    + 'cursor:pointer;transition:right .3s cubic-bezier(.4,0,.2,1);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
    + '.pfly-peek.peek{right:-272px}'        // ~88px (≈25%) shows on hover
    + '.pfly-peek.full{right:0}'             // fully shown briefly before overlay (unused fallback)
    + '#pfly-map{width:100%;height:260px;background:#eef1f4}'
    + '.pfly-peekbar{height:40px;display:flex;align-items:center;gap:6px;padding:0 12px;font-size:12.5px;font-weight:600;color:#1a2330;border-top:1px solid #e3e6ea;white-space:nowrap}'
    // 3/4 overlay (slides right->left; collapse arrow on left-edge center)
    + '.pfly-ovbg{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.45);opacity:0;visibility:hidden;transition:opacity .3s}'
    + '.pfly-ovbg.open{opacity:1;visibility:visible}'
    + '.pfly-ov{position:fixed;top:0;height:100%;width:78%;max-width:1180px;right:-1300px;z-index:100001;background:#fff;'
    + 'transition:right .34s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;'
    + 'box-shadow:-10px 0 34px rgba(0,0,0,.32);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
    + '.pfly-ovtab{position:absolute;left:-34px;top:50%;transform:translateY(-50%);z-index:2;background:#1a73e8;color:#fff;'
    + 'border:none;cursor:pointer;border-radius:12px 0 0 12px;padding:18px 8px;display:flex;flex-direction:column;'
    + 'align-items:center;gap:8px;box-shadow:-2px 2px 12px rgba(0,0,0,.2)}'
    + '.pfly-ovtab b{font-size:18px;line-height:1}'
    + '.pfly-ovtab span{writing-mode:vertical-rl;transform:rotate(180deg);font-size:11.5px;font-weight:600;letter-spacing:.05em}'
    + '.pfly-ovhd{display:flex;align-items:center;gap:10px;padding:16px 20px;border-bottom:1px solid #e3e6ea;flex:0 0 auto}'
    + '.pfly-ovhd h3{margin:0;font-size:16px;color:#1a2330}'
    + '.pfly-ovframe{flex:1;border:0;width:100%}'
    + '#google-reviews-container{cursor:pointer}'
    + '@media(max-width:760px){.pfly-ov{width:100%;max-width:none}.pfly-peek{display:none}}';

  function injectCss(){ var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); }

  function build(){
    var tab=document.createElement('button');
    tab.className='pfly-tab'; tab.setAttribute('aria-label','See recent jobs near you');
    tab.innerHTML='<b>◀</b><span>📍 Recent Jobs</span>';

    var peek=document.createElement('div');
    peek.className='pfly-peek'; peek.id='pfly-peek';
    peek.innerHTML='<div id="pfly-map"></div><div class="pfly-peekbar">📍 Recent jobs near you — click to explore →</div>';

    document.body.appendChild(tab);
    document.body.appendChild(peek);

    // hover -> peek (init the preview map once); click -> full overlay
    function enter(){ clearTimeout(peekTimer); showPeek(); }
    function leave(){ peekTimer=setTimeout(hidePeek,260); }
    tab.addEventListener('mouseenter',enter); tab.addEventListener('mouseleave',leave);
    peek.addEventListener('mouseenter',enter); peek.addEventListener('mouseleave',leave);
    tab.addEventListener('click',openOverlay);
    peek.addEventListener('click',openOverlay);

    // 3/4 overlay
    var bg=document.createElement('div'); bg.className='pfly-ovbg'; bg.id='pfly-ovbg';
    var ov=document.createElement('div'); ov.className='pfly-ov'; ov.id='pfly-ov';
    ov.innerHTML=''
      +'<button class="pfly-ovtab" id="pfly-ovtab" aria-label="Collapse"><b>▶</b><span>CLOSE</span></button>'
      +'<div class="pfly-ovhd"><h3>Our recent work near you</h3></div>'
      +'<iframe class="pfly-ovframe" id="pfly-ovframe" title="Recent projects" loading="lazy"></iframe>';
    document.body.appendChild(bg);
    document.body.appendChild(ov);
    bg.onclick=closeOverlay;
    ov.querySelector('#pfly-ovtab').onclick=closeOverlay;

    var rc=document.getElementById('google-reviews-container');
    if(rc) rc.addEventListener('click',function(e){ if(e.target.closest('a'))return; openOverlay(); });
  }

  function showPeek(){
    document.getElementById('pfly-peek').classList.add('peek');
    if(!dataLoaded){ dataLoaded=true; loadData(); }
    else if(map){ setTimeout(function(){ google.maps.event.trigger(map,'resize'); fitMap(); },320); }
  }
  function hidePeek(){
    var ov=document.getElementById('pfly-ov');
    if(ov && ov.classList.contains('open')) return; // keep context while overlay is open
    document.getElementById('pfly-peek').classList.remove('peek');
  }

  function openOverlay(){
    var ov=document.getElementById('pfly-ov'), bg=document.getElementById('pfly-ovbg');
    if(!ovLoaded){ document.getElementById('pfly-ovframe').src=OVERLAY_URL; ovLoaded=true; }
    bg.classList.add('open'); ov.classList.add('open');
    ov.style.setProperty('right','0px','important'); // page CSS otherwise pins it
    document.body.style.overflow='hidden';
    document.getElementById('pfly-peek').classList.remove('peek');
  }
  function closeOverlay(){
    var ov=document.getElementById('pfly-ov');
    ov.classList.remove('open');
    ov.style.setProperty('right','-1300px','important');
    document.getElementById('pfly-ovbg').classList.remove('open');
    document.body.style.overflow='';
  }

  function loadData(){
    fetch(FEED).then(function(r){return r.json();}).then(function(d){
      items=(d&&d.items)||[]; ensureMaps();
    }).catch(function(){ items=[]; });
  }
  function ensureMaps(){
    if(window.google && window.google.maps && window.google.maps.Map){ return initMap(); }
    if(mapsLoading) return;
    mapsLoading=true; window.__pflyInitMap=initMap;
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
    map=new google.maps.Map(el,{center:TUCSON,zoom:10,disableDefaultUI:true,gestureHandling:'none'});
    markers={};
    items.forEach(function(i){
      if(typeof i.approximate_lat!=='number') return;
      var m=new google.maps.Marker({position:{lat:i.approximate_lat,lng:i.approximate_lng},map:map,title:i.title});
      markers[i.id]=m;
    });
    setTimeout(function(){ if(map){ google.maps.event.trigger(map,'resize'); fitMap(); } },380);
  }

  function start(){ injectCss(); build(); }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',start); } else { start(); }
})();
