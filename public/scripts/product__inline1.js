
    const pid=new URLSearchParams(location.search).get('id');
    const p=storeProducts.find(x=>x.id===pid)||storeProducts[0]; // IDなしなら最初の商品をサンプル表示
    let cart=JSON.parse(localStorage.getItem('am_cart')||'[]');
    function updateBadge(){const b=document.getElementById('hd-cart-badge');b.style.display=cart.length?'flex':'none';b.textContent=cart.length}

    window.onload=function(){
        updateBadge();
        if(!p){document.getElementById('product-main').innerHTML='<p style="padding:60px;text-align:center">商品が見つかりませんでした。</p>';return}
        document.title=p.title+' | AcadeMina';

        document.getElementById('breadcrumb').innerHTML=`<a href="index.html">TOP</a> > <a href="exam.html">院試対策</a> > <a href="exam-store.html">${p.university}</a> > ${p.title.substring(0,30)}...`;

        const contentsHtml=p.contents.map(c=>`<li>${c}</li>`).join('');

        document.getElementById('product-main').innerHTML=`
            <div class="product-img"><img src="${p.img}" alt="${p.title}"></div>
            <h1 class="product-title">${p.title}</h1>
            <h2 class="section-label">概要</h2>
            <p class="product-desc">${p.description}</p>
            <h2 class="section-label">学習内容</h2>
            <ul class="contents-list">${contentsHtml}</ul>
            <h2 class="section-label">本文プレビュー</h2>
            <div class="preview-box">${p.preview} <span style="color:#999">...（続きは購入後にご覧いただけます）</span></div>
        `;

        const priceHtml=p.originalPrice?`<span class="panel-price">¥${p.price.toLocaleString()}</span><span class="panel-original">¥${p.originalPrice.toLocaleString()}</span>`:`<span class="panel-price">¥${p.price.toLocaleString()}</span>`;
        document.getElementById('product-panel').innerHTML=`
            <div class="panel-card">
                <div>${priceHtml}</div>
                <div class="panel-tax">税込</div>
                <button class="btn-primary" onclick="addToCartAndGo()">カートに入れる</button>
                <button class="btn-secondary" onclick="buyNow()">今すぐ購入</button>
                <button class="btn-wish">♡ いいね！</button>
            </div>
        `;
    };
    function addToCartAndGo(){if(!cart.includes(p.id)){cart.push(p.id);localStorage.setItem('am_cart',JSON.stringify(cart));updateBadge()}alert('カートに追加しました')}
    function buyNow(){if(!cart.includes(p.id)){cart.push(p.id);localStorage.setItem('am_cart',JSON.stringify(cart))}location.href='checkout.html'}

;(() => {
  const __am_onload = window.onload;
  if (typeof __am_onload === 'function') {
    window.onload = null;
    if (document.readyState === 'complete') {
      try { __am_onload(); } catch (e) { console.error(e); }
    } else {
      window.addEventListener('load', () => {
        try { __am_onload(); } catch (e) { console.error(e); }
      });
    }
  }
})();
