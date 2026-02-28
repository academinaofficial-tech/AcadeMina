/* =========================================
   AcadeMina 共通パーツ (common.js)
   =========================================
   ヘッダー・フッターを変更するときはこのファイルだけ編集。
   ========================================= */

(function(){
    // ========== ★ サイズ設定（ここだけ変えればOK） ========== //
    var SIZE = {
        logo:       88,   // ヘッダーロゴ (px)
        footerLogo: 200,    // フッターロゴ (px)
        cart:       32,    // カートアイコン (px)
        mypage:     32,    // マイページアイコン (px)
        note:       42,    // note アイコン (px)
        x:          32,    // X アイコン (px)
        instagram:  26     // Instagram アイコン (px)
    };
    // ======================================================= //

    // ========== ヘッダーHTML ==========
    var headerHTML = ''
    + '<header>'
    + '  <a href="index.html" class="logo-link"><img src="images/logo.png" alt="AcadeMina" class="logo-img" style="height:' + SIZE.logo + 'px;width:auto"></a>'
    + '  <div class="hamburger"><span></span><span></span><span></span></div>'
    + '  <nav>'
    + '    <a href="lab.html" data-nav="lab">Lab Insight</a>'
    + '    <a href="exam.html" data-nav="exam">Exam Support</a>'
    + '    <a href="column.html" data-nav="column">Column</a>'
    + '    <a href="about.html" data-nav="about">About Us</a>'
    + '    <div class="nav-icons">'
    + '      <a href="cart.html" class="nav-icon cart-icon" title="カート">'
    + '        <svg viewBox="0 0 24 24" width="' + SIZE.cart + '" height="' + SIZE.cart + '" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 14.26l.04-.12.94-1.7h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020.01 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25z"/></svg>'
    + '        <span class="cart-badge" id="hd-cart-badge" style="display:none">0</span>'
    + '      </a>'
    + '      <a href="mypage.html" class="nav-icon" title="マイページ">'
    + '        <svg viewBox="0 0 24 24" width="' + SIZE.mypage + '" height="' + SIZE.mypage + '" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
    + '      </a>'
    + '      <span class="social-divider"></span>'
    + '      <a href="https://note.com/grand_avocet7665" target="_blank" class="sns-link" title="note">'
    + '        <img src="images/icon-note.png" alt="note" style="width:' + SIZE.note + 'px;height:' + SIZE.note + 'px;border-radius:6px;display:block">'
    + '      </a>'
    + '      <a href="https://x.com/AcadeMina_ofc" target="_blank" class="sns-link" title="X">'
    + '        <img src="images/icon-x.png" alt="X" style="width:' + SIZE.x + 'px;height:' + SIZE.x + 'px;border-radius:6px;display:block">'
    + '      </a>'
    + '      <a href="https://www.instagram.com/academina.official/" target="_blank" class="sns-link" title="Instagram">'
    + '        <img src="images/icon-instagram.png" alt="Instagram" style="width:' + SIZE.instagram + 'px;height:' + SIZE.instagram + 'px;border-radius:6px;display:block">'
    + '      </a>'
    + '    </div>'
    + '    <a href="contact.html" class="nav-cta">Contact</a>'
    + '  </nav>'
    + '</header>';

    // ========== フッターHTML ==========
    var footerHTML = ''
    + '<footer>'
    + '  <div class="footer-logo"><img src="images/logo.png" alt="AcadeMina" style="height:' + SIZE.footerLogo + 'px;width:auto"></div>'
    + '  <div class="footer-links">'
    + '    <ul><li>Company</li><li><a href="about.html">About Us</a></li><li><a href="contact.html">Contact</a></li></ul>'
    + '    <ul><li>Services</li><li><a href="lab.html">Lab Insight</a></li><li><a href="exam.html">Exam Support</a></li><li><a href="exam-store.html">教材ストア</a></li><li><a href="column.html">Column</a></li></ul>'
    + '    <ul><li>Legal</li><li><a href="legal.html">利用規約</a></li><li><a href="legal.html">プライバシーポリシー</a></li></ul>'
    + '  </div>'
    + '</footer>'
    + '<div class="footer-copy">&copy; 2025 AcadeMina. All rights reserved.</div>';

    // ========== 挿入 ==========
    var hdrEl = document.getElementById('common-header');
    if(hdrEl) hdrEl.innerHTML = headerHTML;

    var ftrEl = document.getElementById('common-footer');
    if(ftrEl) ftrEl.innerHTML = footerHTML;

    // ========== アクティブナビ自動判定 ==========
    var path = location.pathname.split('/').pop() || 'index.html';
    var navMap = {
        'lab': ['lab.html','detail.html'],
        'exam': ['exam.html','exam-store.html','product.html','cart.html','checkout.html','order-complete.html'],
        'column': ['column.html','column-detail.html'],
        'about': ['about.html']
    };
    for(var key in navMap){
        if(navMap[key].some(function(p){ return path.indexOf(p) !== -1 })){
            var link = document.querySelector('nav a[data-nav="' + key + '"]');
            if(link) link.classList.add('nav-active');
            break;
        }
    }

    // ========== カートバッジ更新 ==========
    var cart = JSON.parse(localStorage.getItem('am_cart') || '[]');
    var badge = document.getElementById('hd-cart-badge');
    if(badge){
        badge.style.display = cart.length ? 'flex' : 'none';
        badge.textContent = cart.length;
    }

    // ========== ハンバーガーメニュー ==========
    var hamburger = document.querySelector('.hamburger');
    if(hamburger){
        hamburger.onclick = function(){
            document.querySelector('nav').classList.toggle('open');
        };
    }
})();