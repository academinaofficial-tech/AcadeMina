
    let cart = JSON.parse(localStorage.getItem('am_cart')||'[]');

    // ========== マスタータグリスト（スプシのプルダウンと同じものを定義） ==========
    // 運用時はGAS→JSON→GitHubで自動同期される想定
    const masterTags = [
        // 大学
        {tag:'東大院', cat:'大学'},{tag:'東京科学大学院', cat:'大学'},{tag:'京大院', cat:'大学'},{tag:'阪大院', cat:'大学'},{tag:'慶應院', cat:'大学'},{tag:'東北大院', cat:'大学'},{tag:'名大院', cat:'大学'},{tag:'九大院', cat:'大学'},
        // 専攻
        {tag:'情報理工', cat:'専攻'},{tag:'機械工学', cat:'専攻'},{tag:'電気電子', cat:'専攻'},{tag:'数理科学', cat:'専攻'},{tag:'化学', cat:'専攻'},{tag:'生命科学', cat:'専攻'},{tag:'経済学', cat:'専攻'},{tag:'心理学', cat:'専攻'},
        // 教材タイプ
        {tag:'過去問', cat:'タイプ'},{tag:'過去問解説', cat:'タイプ'},{tag:'対策教材', cat:'タイプ'},{tag:'予想問題', cat:'タイプ'},{tag:'合格体験記', cat:'タイプ'},{tag:'研究計画書', cat:'タイプ'},
        // 科目・試験
        {tag:'TOEFL', cat:'試験'},{tag:'TOEIC', cat:'試験'},{tag:'線形代数', cat:'科目'},{tag:'微分方程式', cat:'科目'},{tag:'統計学', cat:'科目'},{tag:'プログラミング', cat:'科目'},{tag:'物理', cat:'科目'},{tag:'有機化学', cat:'科目'},
        // その他
        {tag:'面接対策', cat:'対策'},{tag:'口頭試問', cat:'対策'},{tag:'小論文', cat:'対策'},{tag:'外部受験', cat:'対策'},{tag:'理転', cat:'対策'},{tag:'内部進学', cat:'対策'}
    ];

    let selectedTags = [];

    // ========== タグ選択UI ==========
    function addTag(tagName){
        if(selectedTags.includes(tagName)) return;
        selectedTags.push(tagName);
        renderSelectedTags();
        document.getElementById('search-input').value='';
        closeSuggestions();
        applyFilters();
        if(selectedTags.length>0) document.getElementById('trending-tags').style.display='none';
    }
    function removeTag(tagName){
        selectedTags=selectedTags.filter(t=>t!==tagName);
        renderSelectedTags();
        applyFilters();
        if(selectedTags.length===0) document.getElementById('trending-tags').style.display='flex';
    }
    function renderSelectedTags(){
        const el=document.getElementById('selected-tags');
        el.innerHTML=selectedTags.map(t=>`<span class="selected-tag">#${t}<span class="tag-remove" onclick="removeTag('${t}')">×</span></span>`).join('');
    }

    // ========== タグサジェスト ==========
    function showSuggestions(query){
        const box=document.getElementById('tag-suggestions');
        if(!query||query.length<1){closeSuggestions();return}
        const q=query.toLowerCase();
        const matches=masterTags.filter(m=>m.tag.toLowerCase().includes(q));
        if(!matches.length){closeSuggestions();return}
        box.innerHTML=matches.map(m=>{
            const isSel=selectedTags.includes(m.tag);
            return `<div class="tag-sug-item${isSel?' selected':''}" onclick="addTag('${m.tag}')">#${m.tag}<span class="sug-cat">${m.cat}</span></div>`;
        }).join('');
        box.classList.add('open');
    }
    function closeSuggestions(){document.getElementById('tag-suggestions').classList.remove('open')}

    // ========== カート ==========
    function saveCart(){localStorage.setItem('am_cart',JSON.stringify(cart));updateCartUI()}
    function updateCartUI(){
        const badge=document.getElementById('hd-cart-badge');
        badge.style.display=cart.length?'flex':'none';badge.textContent=cart.length;
        const body=document.getElementById('cart-body');
        if(!cart.length){body.innerHTML='<div class="cart-empty">カートは空です。</div>';document.getElementById('cart-total-price').textContent='¥0';return}
        let html='';let total=0;
        cart.forEach((id,i)=>{const p=storeProducts.find(x=>x.id===id);if(!p)return;total+=p.price;
            html+=`<div class="cart-item"><div class="cart-item-img" style="background-image:url('${p.img}')"></div><div class="cart-item-info"><div class="cart-item-title">${p.title}</div><div class="cart-item-price">¥${p.price.toLocaleString()}</div><button class="cart-item-remove" onclick="removeFromCart(${i})">削除</button></div></div>`;
        });
        body.innerHTML=html;document.getElementById('cart-total-price').textContent='¥'+total.toLocaleString();
    }
    function addToCart(id){if(!cart.includes(id)){cart.push(id);saveCart();toggleCart(true)}}
    function removeFromCart(i){cart.splice(i,1);saveCart()}
    function toggleCart(forceOpen){
        const d=document.getElementById('cart-drawer'),o=document.getElementById('cart-overlay');
        if(forceOpen||!d.classList.contains('open')){d.classList.add('open');o.classList.add('open')}
        else{d.classList.remove('open');o.classList.remove('open')}
    }

    // ========== 商品カード ==========
    function renderCard(p){
        const catName=categoryMap[p.type]||p.type;
        const priceHtml=p.originalPrice?`<span class="prod-price">¥${p.price.toLocaleString()}</span><span class="prod-original">¥${p.originalPrice.toLocaleString()}</span>`:`<span class="prod-price">¥${p.price.toLocaleString()}</span>`;
        return `<div class="product-card"><button class="prod-like" onclick="event.stopPropagation()">♡</button><a href="product.html?id=${p.id}" style="text-decoration:none;color:inherit"><div class="prod-img" style="background-image:url('${p.img}')"></div><div class="prod-body"><div class="prod-cat">${catName}</div><div class="prod-title">${p.title}</div><div class="prod-meta">${priceHtml}<button class="add-cart-btn" onclick="event.preventDefault();event.stopPropagation();addToCart('${p.id}')">カートに追加</button></div></div></a></div>`;
    }

    // ========== フィルター ==========
    function buildFilters(){
        const uf=document.getElementById('univ-filters');
        universityList.forEach(u=>{uf.innerHTML+=`<label><input type="checkbox" value="${u}" onchange="applyFilters()"> ${u}</label>`});
        const tf=document.getElementById('type-filters');
        Object.entries(categoryMap).forEach(([k,v])=>{tf.innerHTML+=`<label><input type="checkbox" value="${k}" onchange="applyFilters()"> ${v}</label>`});
    }
    function applyFilters(){
        const univs=[...document.querySelectorAll('#univ-filters input:checked')].map(x=>x.value);
        const types=[...document.querySelectorAll('#type-filters input:checked')].map(x=>x.value);
        const min=parseInt(document.getElementById('price-min').value)||0;
        const max=parseInt(document.getElementById('price-max').value)||99999;
        // タグベースフィルタ
        let filtered=storeProducts.filter(p=>{
            if(univs.length&&!univs.includes(p.university))return false;
            if(types.length&&!types.includes(p.type))return false;
            if(p.price<min||p.price>max)return false;
            // 選択中のタグで絞り込み（AND条件）
            if(selectedTags.length){
                const pText=(p.title+' '+p.university+' '+(p.department||'')+' '+(p.description||'')+' '+p.tags.join(' ')+' '+(categoryMap[p.type]||'')).toLowerCase();
                for(const tag of selectedTags){
                    if(!pText.includes(tag.toLowerCase()))return false;
                }
            }
            return true;
        });
        renderAll(filtered);
    }

    function renderAll(products){
        const grid=document.getElementById('all-grid');
        grid.innerHTML=products.length?products.map(renderCard).join(''):'<div style="grid-column:1/-1;text-align:center;padding:60px;color:#999">該当する教材が見つかりませんでした。</div>';
        document.getElementById('result-count').textContent=products.length+'件';
    }

    window.onload=function(){
        buildFilters();
        const rec=[...storeProducts].sort((a,b)=>b.downloads-a.downloads).slice(0,4);
        document.getElementById('recommend-grid').innerHTML=rec.map(renderCard).join('');
        renderAll(storeProducts);
        updateCartUI();
        // 検索入力でタグサジェスト
        const input=document.getElementById('search-input');
        input.addEventListener('input',function(){showSuggestions(this.value)});
        input.addEventListener('keydown',function(e){
            if(e.key==='Enter'){
                e.preventDefault();
                // サジェストが開いていれば最初の候補を選択
                const first=document.querySelector('.tag-sug-item:not(.selected)');
                if(first){first.click()}
                else{applyFilters()}
            }
        });
        // クリック外でサジェスト閉じる
        document.addEventListener('click',function(e){
            if(!e.target.closest('.search-wrap'))closeSuggestions();
        });
        document.getElementById('price-min').addEventListener('input',applyFilters);
        document.getElementById('price-max').addEventListener('input',applyFilters);
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
