
// URLパラメータ取得
const urlParams = new URLSearchParams(window.location.search);
const currentDeptId = urlParams.get('deptId');

// 現在のデータ保持用
let currentDept = null;
let currentUniv = null;
let deptProducts = [];

window.onload = function () {
    if (!currentDeptId) {
        document.body.innerHTML = "<p style='padding:40px; text-align:center;'>学科IDが指定されていません。</p>";
        return;
    }

    // 1. データの特定
    currentDept = examDepartments.find(d => d.id === currentDeptId);
    if (!currentDept) {
        document.body.innerHTML = "<p style='padding:40px; text-align:center;'>データが見つかりませんでした。</p>";
        return;
    }
    currentUniv = examUniversities.find(u => u.id === currentDept.univId);

    // 2. ヘッダー描画
    renderHeader();

    // 3. 商品リスト描画
    deptProducts = examProducts.filter(p => p.deptId === currentDeptId);
    renderProducts(deptProducts);

    // 4. レコメンド計算 & 描画
    renderRecommendations();
};

// ヘッダー描画
function renderHeader() {
    const container = document.getElementById('dept-header');

    // タグのHTML生成 (国立/私立, 偏差値, 地域, テーマ)
    let tagsHtml = '';
    currentUniv.tags.forEach(t => tagsHtml += `<span class="text-[0.8rem] px-3 py-[5px] rounded border border-[#ddd] font-bold bg-[#f9f9f9]">${t}</span>`);
    tagsHtml += `<span class="text-[0.8rem] px-3 py-[5px] rounded border border-[#ddd] font-bold bg-[#f9f9f9]">偏差値: ${currentUniv.level}</span>`;
    tagsHtml += `<span class="text-[0.8rem] px-3 py-[5px] rounded border border-[#ddd] font-bold bg-[#f9f9f9]">${currentUniv.area}</span>`;
    tagsHtml += `<span class="text-[0.8rem] px-3 py-[5px] rounded border border-[#cce0ff] font-bold bg-[#e6eeff] text-accent">${currentDept.theme}</span>`; // 学問テーマ

    container.innerHTML = `
                <div class="bg-white py-[60px] px-5 text-center border-b border-[#eee]">
                    <div class="text-[1rem] font-bold text-[#666] mb-2.5">${currentUniv.name}</div>
                    <h1 class="text-[2.5rem] font-extrabold mb-5">${currentDept.name}</h1>
                    <div class="flex justify-center gap-2.5 flex-wrap">${tagsHtml}</div>
                </div>
            `;
}

// 商品リスト描画
function renderProducts(products) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = "<p>現在販売中の商材はありません。</p>";
        return;
    }

    products.forEach(p => {
        // カテゴリ名の日本語変換
        const catMap = { 'past-exam': '過去問解説', 'practice': '対策問題', 'forecast': '予想問題', 'story': '合格体験記', 'plan': '研究計画書' };
        const catName = catMap[p.category] || p.category;

        const html = `
                    <div class="bg-white border border-[#eaeaea] rounded-lg overflow-hidden transition-all duration-200 cursor-pointer hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)]">
                        <div class="h-[160px] bg-[#eee] bg-cover bg-center" style="background-image: url('${p.img}');"></div>
                        <div class="p-5">
                            <div class="text-[0.75rem] font-bold text-accent mb-[5px] uppercase">${catName}</div>
                            <div class="text-[1rem] font-bold leading-[1.5] mb-[15px] h-[3em] overflow-hidden">${p.title}</div>
                            <div class="flex justify-between items-center">
                                <span class="text-[1.1rem] font-extrabold">¥${p.price.toLocaleString()}</span>
                                <button class="text-[0.8rem] px-[15px] py-1.5 rounded-[4px] bg-text text-white border-none cursor-pointer">カートへ</button>
                            </div>
                        </div>
                    </div>
                `;
        container.innerHTML += html;
    });
}

// カテゴリ絞り込み
function filterProducts(category) {
    // ボタンのアクティブ切り替え
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        renderProducts(deptProducts);
    } else {
        const filtered = deptProducts.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// ★ レコメンドロジック ★
function renderRecommendations() {
    const container = document.getElementById('recommend-list');

    // 自分以外の学科リストを作成
    const candidates = examDepartments.filter(d => d.id !== currentDeptId);

    // スコア計算
    const scoredCandidates = candidates.map(dept => {
        const univ = examUniversities.find(u => u.id === dept.univId);
        let score = 0;

        // 1. 学問テーマが同じ (+30点)
        if (dept.theme === currentDept.theme) score += 30;

        // 2. 偏差値ランクが同じ (+20点)
        if (univ.level === currentUniv.level) score += 20;

        // 3. 地域が同じ (+10点)
        if (univ.area === currentUniv.area) score += 10;

        // 4. 国立/私立タグが同じ (+10点)
        const isSameType = univ.tags.some(t => currentUniv.tags.includes(t));
        if (isSameType) score += 10;

        return { dept, univ, score };
    });

    // スコア高い順に並べて、上位3つを表示
    const topRecs = scoredCandidates
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    if (topRecs.length === 0) {
        container.innerHTML = "<p>おすすめの学科はありません。</p>";
        return;
    }

    topRecs.forEach(item => {
        const d = item.dept;
        const u = item.univ;

        const html = `
                    <div class="bg-white p-5 rounded-lg border border-[#eee] flex flex-col justify-between transition-all duration-200 cursor-pointer hover:border-accent hover:bg-[#fdfdfd]" onclick="location.href='exam-detail.html?deptId=${d.id}'">
                        <div>
                            <div class="text-[0.8rem] text-[#666] font-bold mb-[5px]">${u.name}</div>
                            <div class="text-[1.1rem] font-extrabold mb-2.5">${d.name}</div>
                            <div class="flex gap-[5px] flex-wrap">
                                <span class="text-[0.7rem] px-[6px] py-[2px] border border-[#cce0ff] bg-[#e6eeff] text-accent rounded-[2px]">${d.theme}</span>
                                <span class="text-[0.7rem] px-[6px] py-[2px] border border-[#ddd] rounded-[2px]">${u.level}ランク</span>
                                <span class="text-[0.7rem] px-[6px] py-[2px] border border-[#ddd] rounded-[2px]">${u.area}</span>
                            </div>
                        </div>
                        <div style="text-align:right; font-size:0.8rem; margin-top:10px; color:#aaa;">
                            詳細を見る →
                        </div>
                    </div>
                `;
        container.innerHTML += html;
    });
}

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
