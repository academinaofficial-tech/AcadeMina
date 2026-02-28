
        // CMS（microCMS）からコラムとニュースを動的取得
        window.onload = async function() {
            // コラム: おすすめ or 最新3件
            try {
                const colData = await CMS.getFeaturedColumns(3);
                const colGrid = document.getElementById('column-grid');
                if (colData.contents.length) {
                    colGrid.innerHTML = colData.contents.map(a => {
                        const imgUrl = a.thumbnail ? a.thumbnail.url : 'images/col-placeholder.jpg';
                        return `<a href="column-detail.html?id=${a.id}" class="column-card" style="text-decoration:none;color:inherit">
                            <div class="card-img" style="background-image:url('${imgUrl}')"></div>
                            <div class="card-content">
                                <div class="card-meta">${formatDate(a.publishedAt)} / ${a.subcategory || 'Column'}</div>
                                <h3 class="card-title">${a.title}</h3>
                            </div></a>`;
                    }).join('');
                }
            } catch(e) { console.warn('Column load error:', e); }

            // ニュース: 最新3件
            try {
                const newsData = await CMS.getLatestNews(3);
                const newsList = document.getElementById('news-list');
                if (newsData.contents.length) {
                    newsList.innerHTML = newsData.contents.map(n => 
                        `<li class="news-item"><a href="column-detail.html?id=${n.id}" style="display:flex;align-items:baseline;width:100%;text-decoration:none;color:inherit"><span class="news-date">${formatDate(n.publishedAt)}</span><span class="news-tag">${n.subcategory || 'Info'}</span><span class="news-title-text">${n.title}</span><span class="news-arrow">→</span></a></li>`
                    ).join('');
                }
            } catch(e) { console.warn('News load error:', e); }
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
