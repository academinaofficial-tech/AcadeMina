
    let currentPage = 1;
    const PER_PAGE = 6;
    let currentCategory = 'all';

    async function loadArticles(page = 1) {
        currentPage = page;
        const grid = document.getElementById('article-grid');
        grid.innerHTML = '<div class="loading">記事を読み込み中...</div>';

        const options = {
            limit: PER_PAGE,
            offset: (page - 1) * PER_PAGE,
            category: 'column'
        };
        if (currentCategory !== 'all') {
            options.filters = `subcategory[equals]${currentCategory}`;
        }

        const data = await CMS.getArticles(options);
        renderArticles(data.contents, data.totalCount);
    }

    async function loadFeatured() {
        const data = await CMS.getFeaturedColumns(1);
        const area = document.getElementById('featured-area');
        if (data.contents.length === 0) { area.innerHTML = ''; return; }
        const a = data.contents[0];
        const imgUrl = a.thumbnail ? a.thumbnail.url : 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop';
        area.innerHTML = `
            <a href="column-detail.html?id=${a.id}" class="featured" style="text-decoration:none;color:inherit">
                <div class="featured-img" style="background-image:url('${imgUrl}')"></div>
                <div class="featured-content">
                    <span class="featured-badge">FEATURED</span>
                    <h2 class="featured-title">${a.title}</h2>
                    <p class="featured-desc">${truncate(a.description, 120)}</p>
                    <div class="featured-meta">${formatDate(a.publishedAt)} / ${a.subcategory || ''} / ${a.author || ''}</div>
                </div>
            </a>`;
    }

    function renderArticles(articles, total) {
        const grid = document.getElementById('article-grid');
        if (!articles.length) { grid.innerHTML = '<div class="loading">記事が見つかりませんでした。</div>'; return; }
        grid.innerHTML = articles.map(a => {
            const imgUrl = a.thumbnail ? a.thumbnail.url : 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop';
            const tagsHtml = (a.tags || []).slice(0, 3).map(t => `<span class="card-tag">#${t}</span>`).join('');
            return `
                <a href="column-detail.html?id=${a.id}" class="article-card" style="text-decoration:none;color:inherit">
                    <div class="card-img" style="background-image:url('${imgUrl}')"></div>
                    <div class="card-body">
                        <div class="card-sub">${a.subcategory || 'Column'}</div>
                        <h3 class="card-title">${a.title}</h3>
                        <p class="card-desc">${truncate(a.description, 80)}</p>
                        <div class="card-meta"><span>${formatDate(a.publishedAt)}</span><span>${a.author || ''}</span></div>
                        <div class="card-tags">${tagsHtml}</div>
                    </div>
                </a>`;
        }).join('');

        // Pagination
        const totalPages = Math.ceil(total / PER_PAGE);
        const pag = document.getElementById('pagination');
        if (totalPages <= 1) { pag.innerHTML = ''; return; }
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="loadArticles(${i})">${i}</button>`;
        }
        pag.innerHTML = html;
    }

    function filterByCategory(cat) {
        currentCategory = cat;
        document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('grid-title').textContent = cat === 'all' ? 'すべての記事' : cat;
        loadArticles(1);
    }

    window.onload = function() {
        loadFeatured();
        loadArticles(1);
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
