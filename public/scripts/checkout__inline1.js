
const cart = JSON.parse(localStorage.getItem('am_cart') || '[]');
function selectPay(el) { document.querySelectorAll('.pay-option').forEach(o => o.classList.remove('selected')); el.classList.add('selected') }

// プロフィール表示切替（Firebase Auth連携後は実データに置換）
function initProfile() {
    // localStorageにプロフィールがあれば表示モード、なければ入力モード
    const saved = JSON.parse(localStorage.getItem('am_profile') || 'null');
    if (saved && saved.name && saved.email) {
        document.getElementById('prof-name').textContent = saved.name;
        document.getElementById('prof-email').textContent = saved.email;
        document.getElementById('prof-univ').textContent = saved.univ || '未登録';
        document.getElementById('profile-display').style.display = 'block';
        document.getElementById('profile-form').style.display = 'none';
    } else {
        document.getElementById('profile-display').style.display = 'none';
        document.getElementById('profile-form').style.display = 'block';
    }
}

function validateForm() {
    const nameEl = document.getElementById('input-name');
    const emailEl = document.getElementById('input-email');
    const formVisible = document.getElementById('profile-form').style.display !== 'none';
    if (!formVisible) return true;

    let valid = true;
    [nameEl, emailEl].forEach(el => { el.classList.remove('error') });
    if (!nameEl.value.trim()) { nameEl.classList.add('error'); valid = false }
    if (!emailEl.value.trim() || !emailEl.value.includes('@')) { emailEl.classList.add('error'); valid = false }
    return valid;
}

function updatePayButton() {
    const btn = document.getElementById('pay-btn');
    const agreed = document.getElementById('terms-agree').checked;
    btn.disabled = !agreed;
}

window.onload = function () {
    initProfile();
    const container = document.getElementById('summary-items');
    let total = 0;
    if (!cart.length) { container.innerHTML = '<p style="color:#999;padding:20px 0;text-align:center">カートが空です</p>'; return }
    cart.forEach(id => {
        const p = storeProducts.find(x => x.id === id); if (!p) return; total += p.price;
        container.innerHTML += `<div class="flex items-center gap-3 py-2.5 border-b border-[#f0f0f0]"><div class="w-[50px] h-[50px] rounded bg-[#eee] bg-cover shrink-0" style="background-image:url('${p.img}')"></div><div class="text-[0.8rem] font-semibold flex-1 line-clamp-2">${p.title}</div><div class="font-extrabold text-[0.85rem] whitespace-nowrap">¥${p.price.toLocaleString()}</div></div>`;
    });
    document.getElementById('summary-total').textContent = '¥' + total.toLocaleString();
    const btn = document.getElementById('pay-btn');
    btn.textContent = '¥' + total.toLocaleString() + ' を支払って購入を確定する';
    document.getElementById('terms-agree').addEventListener('change', updatePayButton);
};

function processPayment() {
    if (!validateForm()) {
        alert('氏名とメールアドレスを入力してください。');
        return;
    }
    // フォーム入力値を保存
    const formVisible = document.getElementById('profile-form').style.display !== 'none';
    if (formVisible) {
        const profile = {
            name: document.getElementById('input-name').value.trim(),
            email: document.getElementById('input-email').value.trim(),
            univ: document.getElementById('input-univ').value.trim()
        };
        if (document.getElementById('save-profile').checked) {
            localStorage.setItem('am_profile', JSON.stringify(profile));
        }
    }

    const btn = document.getElementById('pay-btn');
    btn.disabled = true; btn.textContent = '決済処理中...';
    setTimeout(() => {
        localStorage.setItem('am_order', JSON.stringify({ items: cart, date: new Date().toISOString(), orderId: 'AM-' + Date.now() }));
        localStorage.removeItem('am_cart');
        location.href = 'order-complete.html';
    }, 1500);
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
