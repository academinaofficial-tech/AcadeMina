
let cart = JSON.parse(localStorage.getItem('am_cart') || '[]');
function saveCart() { localStorage.setItem('am_cart', JSON.stringify(cart)); render() }
function removeItem(id) { cart = cart.filter(x => x !== id); saveCart() }
function render() {
  const main = document.getElementById('cart-main'), side = document.getElementById('cart-sidebar');
  if (!cart.length) {
    main.innerHTML = '<div class="text-center py-20 px-5"><h2 class="text-[1.5rem] font-extrabold mb-[15px]">カートは空です</h2><p class="text-[#666] mb-[30px]">教材を探しに行きましょう。</p><a href="exam-store" class="inline-block px-10 py-[14px] bg-text text-white rounded-full font-bold">教材ストアへ</a></div>';
    side.innerHTML = ''; return;
  }
  let html = '', total = 0;
  cart.forEach(id => {
    const p = storeProducts.find(x => x.id === id); if (!p) return; total += p.price;
    html += `<div class="flex flex-wrap md:flex-nowrap items-center gap-5 bg-white p-5 rounded-lg border border-border mb-[15px]"><div class="w-[100px] h-[20px] rounded-md bg-[#eee] bg-cover shrink-0" style="background-image:url('${p.img}')"></div><div class="flex-1 min-w-0"><div class="text-[0.95rem] font-bold mb-[5px]">${p.title}</div><div class="text-[0.8rem] text-[#888] mb-2">${p.author}</div><div class="flex gap-[15px]"><button class="bg-transparent border-none text-[0.85rem] cursor-pointer text-[#666] font-semibold hover:text-[#ff4757] transition-colors" onclick="removeItem('${p.id}')">削除</button><button class="bg-transparent border-none text-[0.85rem] cursor-pointer text-[#666] font-semibold hover:text-accent transition-colors">あとで買う</button></div></div><div class="text-[1.1rem] font-extrabold whitespace-nowrap">¥${p.price.toLocaleString()}</div></div>`;
  });
  main.innerHTML = html;
  side.innerHTML = `<div class="bg-white border border-border rounded-xl p-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]"><div class="flex justify-between mb-3 text-[0.95rem]"><span>小計（${cart.length}点）</span><span>¥${total.toLocaleString()}</span></div><div class="flex justify-between text-[1.3rem] font-extrabold pt-[15px] border-t-2 border-text my-5"><span>合計（税込）</span><span>¥${total.toLocaleString()}</span></div><div class="flex gap-2 mb-5"><input type="text" placeholder="クーポンコード" class="flex-1 p-[10px] border border-border rounded-md text-[0.9rem]"><button class="px-[16px] py-[10px] bg-gray border border-border rounded-md font-bold text-[0.85rem] cursor-pointer">適用</button></div><a href="checkout" class="block w-full p-4 bg-accent text-white border-none rounded-full text-[1.1rem] font-bold cursor-pointer text-center transition-all duration-200 hover:bg-[#003399] hover:-translate-y-[1px] no-underline">レジに進む →</a></div>`;
  // Recommend
  const rec = storeProducts.filter(x => !cart.includes(x.id)).slice(0, 4);
  if (rec.length) {
    let rh = '<h2 class="text-[1.3rem] font-extrabold mb-5">こちらもおすすめ</h2><div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[15px]">';
    rec.forEach(r => { rh += `<a href="product?id=${r.id}" class="bg-white border border-border rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-[3px] no-underline text-inherit block"><div class="h-[120px] bg-[#eee] bg-cover bg-center" style="background-image:url('${r.img}')"></div><div class="p-3"><div class="text-[0.7rem] text-accent font-bold mb-[3px]">${categoryMap[r.type] || r.type}</div><div class="text-[0.85rem] font-bold mb-[5px] line-clamp-2">${r.title}</div><div class="font-extrabold text-[0.9rem]">¥${r.price.toLocaleString()}</div></div></a>` });
    rh += '</div>'; document.getElementById('recommend-section').innerHTML = rh;
  }
}
window.onload = render;

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
