
    let cart=JSON.parse(localStorage.getItem('am_cart')||'[]');
    function saveCart(){localStorage.setItem('am_cart',JSON.stringify(cart));render()}
    function removeItem(id){cart=cart.filter(x=>x!==id);saveCart()}
    function render(){
        const main=document.getElementById('cart-main'),side=document.getElementById('cart-sidebar');
        if(!cart.length){
            main.innerHTML='<div class="cart-empty"><h2>カートは空です</h2><p>教材を探しに行きましょう。</p><a href="exam-store.html">教材ストアへ</a></div>';
            side.innerHTML='';return;
        }
        let html='',total=0;
        cart.forEach(id=>{const p=storeProducts.find(x=>x.id===id);if(!p)return;total+=p.price;
            html+=`<div class="cart-item"><div class="cart-item-img" style="background-image:url('${p.img}')"></div><div class="cart-item-info"><div class="cart-item-title">${p.title}</div><div class="cart-item-author">${p.author}</div><div class="cart-item-actions"><button class="remove" onclick="removeItem('${p.id}')">削除</button><button>あとで買う</button></div></div><div class="cart-item-price">¥${p.price.toLocaleString()}</div></div>`;
        });
        main.innerHTML=html;
        side.innerHTML=`<div class="summary-card"><div class="summary-row"><span>小計（${cart.length}点）</span><span>¥${total.toLocaleString()}</span></div><div class="summary-total"><span>合計（税込）</span><span>¥${total.toLocaleString()}</span></div><div class="coupon-input"><input type="text" placeholder="クーポンコード"><button>適用</button></div><a href="checkout.html" class="checkout-btn" style="text-decoration:none;display:block;text-align:center;color:#fff">レジに進む →</a></div>`;
        // Recommend
        const rec=storeProducts.filter(x=>!cart.includes(x.id)).slice(0,4);
        if(rec.length){
            let rh='<h2 class="rec-title">こちらもおすすめ</h2><div class="rec-grid">';
            rec.forEach(r=>{rh+=`<a href="product.html?id=${r.id}" class="rec-card" style="text-decoration:none;color:inherit"><div class="rec-img" style="background-image:url('${r.img}')"></div><div class="rec-body"><div class="rec-cat">${categoryMap[r.type]||r.type}</div><div class="rec-name">${r.title}</div><div class="rec-price">¥${r.price.toLocaleString()}</div></div></a>`});
            rh+='</div>';document.getElementById('recommend-section').innerHTML=rh;
        }
    }
    window.onload=render;

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
