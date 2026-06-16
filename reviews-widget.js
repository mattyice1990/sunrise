/**
 * Google reviews widget — renders a "★ 5.0 · 40 Google reviews" badge plus
 * recent review cards from the existing /api/reviews endpoint (Google Places).
 * Self-contained, namespaced .grev-*.
 *
 * Embed:
 *   <div id="sunrise-reviews"></div>
 *   <script src="/reviews-widget.js" async></script>
 * (If #sunrise-reviews is absent, the widget appends itself to <body>.)
 */
(function () {
  var ENDPOINT = '/api/reviews';
  var PLACE_ID = 'ChIJHXIqAP-aBkER6Ogp_xUh9Cc';
  var ALL_REVIEWS_URL = 'https://search.google.com/local/reviews?placeid=' + PLACE_ID;

  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function stars(n){ n=Math.round(n||0); var o=''; for(var i=0;i<5;i++) o+= i<n?'★':'☆'; return o; }

  var css = ''
    + '.grev{max-width:1180px;margin:0 auto;padding:24px 20px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1a2330}'
    + '.grev-top{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:18px}'
    + '.grev-g{font-size:22px;font-weight:700}'
    + '.grev-g .b{color:#4285F4}.grev-g .r{color:#EA4335}.grev-g .y{color:#FBBC05}.grev-g .g{color:#34A853}'
    + '.grev-score{font-size:30px;font-weight:800;line-height:1}'
    + '.grev-stars{color:#FBBC05;font-size:20px;letter-spacing:1px}'
    + '.grev-meta{color:#5f6368;font-size:14px}'
    + '.grev-all{margin-left:auto;background:#1a73e8;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:10px 16px;border-radius:8px}'
    + '.grev-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}'
    + '.grev-card{border:1px solid #e3e6ea;border-radius:12px;padding:16px;background:#fff;display:flex;flex-direction:column;gap:8px}'
    + '.grev-who{display:flex;align-items:center;gap:10px}'
    + '.grev-who img{width:40px;height:40px;border-radius:50%;object-fit:cover;background:#eef1f4}'
    + '.grev-name{font-weight:600;font-size:14px;margin:0}'
    + '.grev-when{color:#79828d;font-size:12px;margin:0}'
    + '.grev-cs{color:#FBBC05;font-size:14px;letter-spacing:1px}'
    + '.grev-text{font-size:13.5px;line-height:1.5;color:#48515c;margin:0;display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;overflow:hidden}'
    + '.grev-empty{color:#79828d}'
    + '@media(max-width:560px){.grev-all{margin-left:0}}';

  function mount(){
    var host=document.getElementById('sunrise-reviews');
    if(!host){ host=document.createElement('section'); host.id='sunrise-reviews'; document.body.appendChild(host); }
    var style=document.createElement('style'); style.textContent=css; document.head.appendChild(style);
    host.innerHTML='<div class="grev"><p class="grev-empty">Loading reviews…</p></div>';

    fetch(ENDPOINT).then(function(r){return r.json();}).then(function(d){
      if(!d || d.status!=='success'){ host.innerHTML=''; return; }
      render(host, d);
    }).catch(function(){ host.innerHTML=''; });
  }

  function render(host,d){
    var reviews=(d.reviews||[]).slice(0,6);
    var cards=reviews.map(function(rv){
      return '<div class="grev-card"><div class="grev-who">'
        +(rv.profile_photo_url?'<img src="'+esc(rv.profile_photo_url)+'" alt="" loading="lazy">':'')
        +'<div><p class="grev-name">'+esc(rv.author_name)+'</p><p class="grev-when">'+esc(rv.relative_time_description)+'</p></div></div>'
        +'<div class="grev-cs">'+stars(rv.rating)+'</div>'
        +'<p class="grev-text">'+esc(rv.text)+'</p></div>';
    }).join('');

    host.innerHTML='<div class="grev">'
      +'<div class="grev-top">'
        +'<span class="grev-g"><span class="b">G</span><span class="r">o</span><span class="y">o</span><span class="b">g</span><span class="g">l</span><span class="r">e</span> Reviews</span>'
        +'<span class="grev-score">'+(d.rating||5).toFixed(1)+'</span>'
        +'<span class="grev-stars">'+stars(d.rating)+'</span>'
        +'<span class="grev-meta">'+(d.totalReviews||0)+' reviews</span>'
        +'<a class="grev-all" href="'+ALL_REVIEWS_URL+'" target="_blank" rel="noopener">Read all on Google →</a>'
      +'</div>'
      +'<div class="grev-row">'+(cards||'<p class="grev-empty">Reviews coming soon.</p>')+'</div>'
      +'</div>';
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',mount); } else { mount(); }
})();
