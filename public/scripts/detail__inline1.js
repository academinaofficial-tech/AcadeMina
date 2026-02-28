
        // URLの ?id=xxx を取得する関数
        function getParam(name) {
            const url = new URL(window.location.href);
            return url.searchParams.get(name);
        }

        window.onload = function() {
            const labId = getParam('id');
            const lab = labsData.find(d => d.id === labId);

            if (!lab) {
                document.getElementById('detail-content').innerHTML = "<p style='padding:50px; text-align:center;'>研究室データが見つかりませんでした。</p>";
                return;
            }

            // タグHTML生成
            const tagsHtml = lab.tags.map(t => `<span class="hero-tag">#${t}</span>`).join('');

            // 論文リストHTML生成
            let papersHtml = '';
            if (lab.papers && lab.papers.length > 0) {
                papersHtml = '<ul class="paper-list">';
                lab.papers.forEach(p => {
                    papersHtml += `
                        <li class="paper-item">
                            <span class="paper-title">${p.title}</span>
                            <p class="paper-summary">${p.summary}</p>
                            <a href="${p.link}" class="paper-link">Read Paper →</a>
                        </li>
                    `;
                });
                papersHtml += '</ul>';
            } else {
                papersHtml = '<p>登録された論文情報はありません。</p>';
            }

            // 円グラフの値 (データがない場合は0)
            const st = lab.stats || { gender: 0, international: 0, working: 0 };

            // HTML生成
            const html = `
                <section class="lab-hero" style="background-image: url('${lab.heroImg}');">
                    <div class="lab-hero-overlay">
                        <div class="lab-hero-content">
                            <div class="lab-univ-name">${lab.univ}</div>
                            <h1 class="lab-title">${lab.name}</h1>
                            <div class="hero-tags">${tagsHtml}</div>
                        </div>
                    </div>
                </section>

                <div class="container">
                    
                    <section class="info-section">
                        <h2 class="section-title">Basic Information</h2>
                        <div style="text-align:center;">
                            <a href="${lab.website}" target="_blank" class="website-btn">Visit Official Website ↗</a>
                        </div>

                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="pie-chart" style="--p: ${st.gender}%">
                                    <span class="pie-value">${st.gender}%</span>
                                </div>
                                <div class="stat-label">女性比率</div>
                            </div>
                            <div class="stat-item">
                                <div class="pie-chart" style="--p: ${st.international}%">
                                    <span class="pie-value">${st.international}%</span>
                                </div>
                                <div class="stat-label">留学生比率</div>
                            </div>
                            <div class="stat-item">
                                <div class="pie-chart" style="--p: ${st.working}%">
                                    <span class="pie-value">${st.working}%</span>
                                </div>
                                <div class="stat-label">社会人比率</div>
                            </div>
                        </div>
                    </section>

                    <section class="info-section">
                        <h2 class="section-title">Research & Papers</h2>
                        <p class="about-text">${lab.about}</p>
                        
                        <h3 style="font-size:1.2rem; margin-bottom:20px; font-weight:800;">Selected Papers</h3>
                        ${papersHtml}
                    </section>

                    <section class="info-section">
                        <h2 class="section-title">Professor's Message</h2>
                        <div class="message-box">
                            <div class="prof-profile">
                                <img src="${lab.profImg}" alt="${lab.profName}" class="prof-large-img">
                                <div class="prof-name-large">${lab.profName}</div>
                            </div>
                            <div class="message-content">
                                <p class="message-text">${lab.message}</p>
                            </div>
                        </div>
                    </section>

                    <section class="info-section">
                        <h2 class="section-title">Contact</h2>
                        <div class="contact-box">
                            <div style="margin-bottom:20px;">
                                <div class="contact-label">Professor's Email</div>
                                <span class="contact-email">${lab.contact.prof}</span>
                            </div>
                            <div>
                                <div class="contact-label">Lab Office / Assistant</div>
                                <span class="contact-email">${lab.contact.assistant}</span>
                            </div>
                            <p class="contact-note">※お問い合わせの際は、件名に「研究室見学希望」等と明記してください。</p>
                        </div>
                    </section>

                </div>
            `;

            document.getElementById('detail-content').innerHTML = html;
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
