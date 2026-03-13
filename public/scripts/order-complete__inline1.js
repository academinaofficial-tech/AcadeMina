
const order = JSON.parse(localStorage.getItem('am_order') || 'null');
window.onload = function () {
  if (!order) {
    document.querySelector('.complete-card').innerHTML = '<h2 style="padding:40px;font-size:1.3rem">注文情報が見つかりませんでした。</h2><a href="exam-store.html" class="btn-store" style="display:inline-block;margin-top:20px;padding:14px 36px;border:1px solid #e0e0e0;border-radius:50px;font-weight:700">教材ストアへ</a>';
    return;
  }
  // Order number
  document.getElementById('order-number').textContent = order.orderId || 'AM-' + Date.now();
  // Download items
  const dlContainer = document.getElementById('download-items');
  if (order.items && order.items.length) {
    order.items.forEach(id => {
      const p = storeProducts.find(x => x.id === id); if (!p) return;
      dlContainer.innerHTML += `<div class="flex items-center gap-[15px] py-3 border-b border-[#e8eeff] last:border-b-0"><div class="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white text-[1rem] shrink-0">📄</div><div class="flex-1 text-left"><div class="text-[0.9rem] font-bold mb-[2px]">${p.title}</div><div class="text-[0.75rem] text-[#999]">PDF・約45ページ</div></div><button class="px-5 py-2 bg-accent text-white border-none rounded-full text-[0.85rem] font-bold cursor-pointer transition-all duration-200 hover:bg-[#003399] hover:-translate-y-[1px]" onclick="alert('実際の実装ではFirebase Cloud StorageのSigned URLからダウンロードされます')">ダウンロード</button></div>`;
    });
  }
  // Cross-sell: show products not purchased
  const purchased = order.items || [];
  const recs = storeProducts.filter(x => !purchased.includes(x.id)).slice(0, 3);
  const grid = document.getElementById('crosssell-grid');
  recs.forEach(r => {
    grid.innerHTML += `<a href="product?id=${r.id}" class="bg-white border border-border rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-[3px] no-underline text-inherit block"><div class="h-[110px] bg-[#eee] bg-cover bg-center" style="background-image:url('${r.img}')"></div><div class="p-3"><div class="text-[0.7rem] text-accent font-bold mb-[3px]">${categoryMap[r.type] || r.type}</div><div class="text-[0.85rem] font-bold mb-[5px] line-clamp-2">${r.title}</div><div class="font-extrabold text-[0.9rem]">¥${r.price.toLocaleString()}</div></div></a>`;
  });
};

; (() => {
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
