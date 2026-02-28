
        // URLからIDを取得して表示する
        window.onload = function() {
            // URLパラメータ ?id=xxx を取得
            const urlParams = new URLSearchParams(window.location.search);
            const newsId = urlParams.get('id');

            // データから該当する記事を探す
            let article = null;
            if (typeof newsData !== 'undefined') {
                article = newsData.find(d => d.id === newsId);
            }

            const container = document.getElementById('article-content');

            if (article) {
                // 記事が見つかった場合
                container.innerHTML = `
                    <div class="article-header">
                        <div class="article-meta">
                            <span class="article-date">${article.date}</span>
                            <span class="article-cat">${article.category}</span>
                        </div>
                        <h1 class="article-title">${article.title}</h1>
                    </div>
                    <div class="article-body">
                        ${article.body}
                    </div>
                `;
                document.title = `${article.title} | AcadeMina News`;
            } else {
                // 記事がない場合
                container.innerHTML = `<p style="text-align:center; padding:50px;">記事が見つかりませんでした。</p>`;
            }
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
