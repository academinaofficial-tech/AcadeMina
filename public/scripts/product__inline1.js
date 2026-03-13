
const pid = new URLSearchParams(location.search).get('id');
const p = storeProducts.find(x => x.id === pid) || storeProducts[0]; // IDなしなら最初の商品をサンプル表示
let cart = JSON.parse(localStorage.getItem('am_cart') || '[]');
function updateBadge() { const b = document.getElementById('hd-cart-badge'); b.style.display = cart.length ? 'flex' : 'none'; b.textContent = cart.length }

window.onload = function () {
  updateBadge();
  if (!p) { document.getElementById('product-main').innerHTML = '<p style="padding:60px;text-align:center">商品が見つかりませんでした。</p>'; return }
  document.title = p.title + ' | AcadeMina';

  document.getElementById('breadcrumb').innerHTML = `<a href="index.html">TOP</a> > <a href="exam.html">院試対策</a> > <a href="exam-store.html">${p.university}</a> > ${p.title.substring(0, 30)}...`;

  const contentsHtml = p.contents.map(c => `<li>${c}</li>`).join('');

  document.getElementById('product-main').innerHTML = `
            <div class="w-full aspect-video rounded-xl overflow-hidden bg-[#eee] mb-[30px]"><img src="${p.img}" alt="${p.title}" class="w-full h-full object-cover"></div>
            <h1 class="text-[1.8rem] font-extrabold leading-[1.4] mb-[15px]">${p.title}</h1>
            <h2 class="text-[1.2rem] font-extrabold mb-[15px] pb-2 border-b-2 border-text">概要</h2>
            <p class="mb-[30px] text-[1rem] leading-[1.9] text-[#444]">${p.description}</p>
            <h2 class="text-[1.2rem] font-extrabold mb-[15px] pb-2 border-b-2 border-text">学習内容</h2>
            <ul class="list-none mb-[30px] [&_li]:py-3 [&_li]:border-b [&_li]:border-[#eee] [&_li]:flex [&_li]:items-center [&_li]:gap-2.5 [&_li]:text-[0.95rem] [&_li]:before:content-['✓'] [&_li]:before:text-accent [&_li]:before:font-bold">${contentsHtml}</ul>
            <h2 class="text-[1.2rem] font-extrabold mb-[15px] pb-2 border-b-2 border-text">本文プレビュー</h2>
            <div class="bg-white border border-border rounded-lg p-[25px] mb-[30px] text-[0.95rem] text-[#555] leading-[1.9]">${p.preview} <span style="color:#999">...（続きは購入後にご覧いただけます）</span></div>
        `;

  const priceHtml = p.originalPrice ? `<span class="text-[2rem] font-extrabold mb-[5px]">¥${p.price.toLocaleString()}</span><span class="line-through text-[#999] text-[1rem] ml-2">¥${p.originalPrice.toLocaleString()}</span>` : `<span class="text-[2rem] font-extrabold mb-[5px]">¥${p.price.toLocaleString()}</span>`;
  document.getElementById('product-panel').innerHTML = `
            <div class="bg-white border border-border rounded-xl p-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div>${priceHtml}</div>
                <div class="text-[0.8rem] text-[#999] mb-5">税込</div>
                <button class="block w-full p-4 bg-accent text-white border-none rounded-full text-[1.1rem] font-bold cursor-pointer mb-2.5 transition-all duration-200 hover:bg-[#003399] hover:-translate-y-[1px]" onclick="addToCartAndGo()">カートに入れる</button>
                <button class="block w-full p-[14px] bg-text text-white border-none rounded-full text-[1rem] font-semibold cursor-pointer mb-5 transition-all duration-200 hover:opacity-85" onclick="buyNow()">今すぐ購入</button>
                <button class="block w-full p-3 bg-transparent border border-border rounded-full text-[0.9rem] cursor-pointer mb-5 transition-all duration-200 hover:border-accent hover:text-accent">♡ いいね！</button>
            </div>
        `;
};
function addToCartAndGo() { if (!cart.includes(p.id)) { cart.push(p.id); localStorage.setItem('am_cart', JSON.stringify(cart)); updateBadge() } alert('カートに追加しました') }
function buyNow() { if (!cart.includes(p.id)) { cart.push(p.id); localStorage.setItem('am_cart', JSON.stringify(cart)) } location.href = 'checkout.html' }

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
