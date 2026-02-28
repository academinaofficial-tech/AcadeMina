
    const articleId = new URLSearchParams(location.search).get('id');

    async function loadArticle() {
        if (!articleId) { document.getElementById('article-main').innerHTML = '<p style="padding:60px;text-align:center">記事IDが指定されていません。</p>'; return; }
        
        const article = await CMS.getArticle(articleId);
        if (!article) { document.getElementById('article-main').innerHTML = '<p style="padding:60px;text-align:center">記事が見つかりませんでした。</p>'; return; }

        document.title = article.title + ' | AcadeMina Column';
        document.getElementById('breadcrumb').innerHTML = `<a href="index.html">TOP</a> > <a href="column.html">Column</a> > ${truncate(article.title, 30)}`;

        const imgUrl = article.thumbnail ? article.thumbnail.url : '';
        const tagsHtml = (article.tags || []).map(t => `<span class="article-tag">#${t}</span>`).join('');
        const heroImg = imgUrl ? `<div class="article-hero-img" style="background-image:url('${imgUrl}')"></div>` : '';

        document.getElementById('article-main').innerHTML = `
            <div class="article-container">
                ${heroImg}
                <div class="article-content">
                    <div class="article-meta">
                        <span class="meta-cat">${article.subcategory || 'Column'}</span>
                        <span class="meta-date">${formatDate(article.publishedAt)}</span>
                        <span class="meta-author">${article.author || ''}</span>
                    </div>
                    <h1 class="article-title">${article.title}</h1>
                    <div class="article-tags">${tagsHtml}</div>
                    <div class="article-body">${article.body}</div>
                    <div class="share-bar">
                        <span class="share-label">Share</span>
                        <button class="share-btn" onclick="window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(location.href),'_blank')">𝕏</button>
                        <button class="share-btn" onclick="navigator.clipboard.writeText(location.href);this.textContent='✓';setTimeout(()=>this.textContent='🔗',1500)">🔗</button>
                    </div>
                </div>
            </div>`;
    }

    async function loadSidebar() {
        const data = await CMS.getArticles({ limit: 5, category: 'column', orders: '-publishedAt' });
        const sidebar = document.getElementById('article-sidebar');
        
        // Related articles
        const related = data.contents.filter(a => a.id !== articleId).slice(0, 4);
        let relHtml = related.map(a => {
            const imgUrl = a.thumbnail ? a.thumbnail.url : 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=200&auto=format&fit=crop';
            return `<a href="column-detail.html?id=${a.id}" class="sidebar-item" style="text-decoration:none;color:inherit"><div class="sb-img" style="background-image:url('${imgUrl}')"></div><div class="sb-info"><div class="sb-title">${a.title}</div><div class="sb-date">${formatDate(a.publishedAt)}</div></div></a>`;
        }).join('');

        sidebar.innerHTML = `
            <div class="sidebar-card">
                <div class="sidebar-title">最新の記事</div>
                ${relHtml}
            </div>
            <div class="sidebar-cta">
                <h3>院試の「武器」を手に入れよう</h3>
                <p>過去問解説、研究計画書テンプレート、合格体験記など</p>
                <a href="exam-store.html">教材ストアへ →</a>
            </div>`;
    }

    window.onload = function() {
        loadArticle();
        loadSidebar();
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
