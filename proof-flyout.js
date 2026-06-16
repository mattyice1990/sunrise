/**
 * Recent-work proof flyout — a full-height panel docked off the right edge.
 *  - A tall "See work near you" ribbon tab is always visible on the edge.
 *  - HOVER the ribbon -> the full-height work panel peeks out a sliver
 *    (page-reveal teaser).
 *  - CLICK the ribbon (or a homepage review) -> the panel slides fully open
 *    (loads /recent-projects inline). Click the ribbon again or the dimmed
 *    backdrop -> it closes up.
 * Self-contained, namespaced .pfly-*. Embed: <script src="/proof-flyout.js" async></script>
 */
(function () {
  var OVERLAY_URL = '/recent-projects';
  var ov, bg, tab, STATE = 'closed', loaded = false, leaveTimer = null;

  var css = ''
    + '.pfly-ovbg{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.45);opacity:0;visibility:hidden;transition:opacity .3s}'
    + '.pfly-ovbg.open{opacity:1;visibility:visible}'
    + '.pfly-ov{position:fixed;top:0;height:100%;width:80%;max-width:1200px;right:-2000px;z-index:100001;background:#fff;'
    + 'transition:right .34s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;'
    + 'box-shadow:-12px 0 36px rgba(0,0,0,.3);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
    // tall ribbon handle on the panel's left edge (sticks out when closed)
    + '.pfly-ovtab{position:absolute;left:-48px;top:50%;transform:translateY(-50%);z-index:2;background:#2f6fed;color:#fff;'
    + 'border:none;cursor:pointer;border-radius:14px 0 0 14px;padding:44px 15px;display:flex;align-items:center;justify-content:center;'
    + 'box-shadow:-3px 3px 16px rgba(0,0,0,.22);transition:background .2s}'
    + '.pfly-ovtab:hover{background:#2256c9}'
    + '.pfly-ovtab::before{content:"";position:absolute;left:-11px;top:50%;transform:translateY(-50%);'
    + 'border-top:13px solid transparent;border-bottom:13px solid transparent;border-right:12px solid #2f6fed}'
    + '.pfly-ovtab:hover::before{border-right-color:#2256c9}'
    + '.pfly-ovtab .lbl{writing-mode:vertical-rl;transform:rotate(180deg);font-size:16px;font-weight:600;letter-spacing:.05em}'
    + '.pfly-ovhd{display:flex;align-items:center;gap:10px;padding:16px 20px 16px 28px;border-bottom:1px solid #e3e6ea;flex:0 0 auto}'
    + '.pfly-ovhd h3{margin:0;font-size:16px;color:#1a2330}'
    + '.pfly-ovframe{flex:1;border:0;width:100%}'
    + '#google-reviews-container{cursor:pointer}'
    + '@media(max-width:760px){.pfly-ov{width:100%;max-width:none}}';

  function injectCss(){ var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); }
  function W(){ return ov.offsetWidth || 1100; }
  function ensureLoaded(){ if(!loaded){ document.getElementById('pfly-ovframe').src=OVERLAY_URL; loaded=true; } }

  // closed: only the ribbon shows; peek: ribbon + ~110px sliver, full height; full: open.
  function setState(s){
    STATE=s;
    if(s==='closed'){ ov.style.right = -(W()-48)+'px'; bg.classList.remove('open'); document.body.style.overflow=''; }
    else if(s==='peek'){ ensureLoaded(); ov.style.right = -(W()-160)+'px'; bg.classList.remove('open'); document.body.style.overflow=''; }
    else { ensureLoaded(); ov.style.right='0px'; bg.classList.add('open'); document.body.style.overflow='hidden'; }
  }

  function build(){
    bg=document.createElement('div'); bg.className='pfly-ovbg'; bg.id='pfly-ovbg';
    ov=document.createElement('div'); ov.className='pfly-ov'; ov.id='pfly-ov';
    ov.innerHTML=''
      +'<button class="pfly-ovtab" id="pfly-ovtab" aria-label="See our work near you"><span class="lbl">See work near you</span></button>'
      +'<div class="pfly-ovhd"><h3>Our recent work near you</h3></div>'
      +'<iframe class="pfly-ovframe" id="pfly-ovframe" title="Recent projects" loading="lazy"></iframe>';
    document.body.appendChild(bg);
    document.body.appendChild(ov);
    tab=document.getElementById('pfly-ovtab');

    tab.addEventListener('mouseenter',function(){ clearTimeout(leaveTimer); if(STATE==='closed') setState('peek'); });
    ov.addEventListener('mouseenter',function(){ clearTimeout(leaveTimer); });
    ov.addEventListener('mouseleave',function(){ if(STATE==='peek'){ leaveTimer=setTimeout(function(){ if(STATE==='peek') setState('closed'); },220); } });
    tab.addEventListener('click',function(){ setState(STATE==='full'?'closed':'full'); });
    bg.addEventListener('click',function(){ setState('closed'); });

    var rc=document.getElementById('google-reviews-container');
    if(rc) rc.addEventListener('click',function(e){ if(e.target.closest('a'))return; setState('full'); });

    setState('closed');
  }

  function start(){ injectCss(); build(); requestAnimationFrame(function(){ setState('closed'); }); }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',start); } else { start(); }
})();
