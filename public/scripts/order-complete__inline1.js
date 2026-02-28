
    const order=JSON.parse(localStorage.getItem('am_order')||'null');
    window.onload=function(){
        if(!order){
            document.querySelector('.complete-card').innerHTML='<h2 style="padding:40px;font-size:1.3rem">注文情報が見つかりませんでした。</h2><a href="exam-store.html" class="btn-store" style="display:inline-block;margin-top:20px;padding:14px 36px;border:1px solid #e0e0e0;border-radius:50px;font-weight:700">教材ストアへ</a>';
            return;
        }
        // Order number
        document.getElementById('order-number').textContent=order.orderId||'AM-'+Date.now();
        // Download items
        const dlContainer=document.getElementById('download-items');
        if(order.items&&order.items.length){
            order.items.forEach(id=>{
                const p=storeProducts.find(x=>x.id===id);if(!p)return;
                dlContainer.innerHTML+=`<div class="download-item"><div class="dl-icon">📄</div><div class="dl-info"><div class="dl-name">${p.title}</div><div class="dl-size">PDF・約45ページ</div></div><button class="dl-btn" onclick="alert('実際の実装ではFirebase Cloud StorageのSigned URLからダウンロードされます')">ダウンロード</button></div>`;
            });
        }
        // Cross-sell: show products not purchased
        const purchased=order.items||[];
        const recs=storeProducts.filter(x=>!purchased.includes(x.id)).slice(0,3);
        const grid=document.getElementById('crosssell-grid');
        recs.forEach(r=>{
            grid.innerHTML+=`<a href="product.html?id=${r.id}" class="cs-card" style="text-decoration:none;color:inherit"><div class="cs-img" style="background-image:url('${r.img}')"></div><div class="cs-body"><div class="cs-cat">${categoryMap[r.type]||r.type}</div><div class="cs-name">${r.title}</div><div class="cs-price">¥${r.price.toLocaleString()}</div></div></a>`;
        });
    };

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
