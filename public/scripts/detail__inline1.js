
// URLの ?id=xxx を取得する関数
function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

window.onload = function () {
    const labId = getParam('id');
    const lab = labsData.find(d => d.id === labId);

    if (!lab) {
        document.getElementById('detail-content').innerHTML = "<p style='padding:50px; text-align:center;'>研究室データが見つかりませんでした。</p>";
        return;
    }

    // タグHTML生成
    const tagsHtml = lab.tags.map(t => `<span class="bg-white/20 backdrop-blur-[5px] py-[5px] px-[15px] rounded-full text-[0.9rem] border border-white/40">#${t}</span>`).join('');

    // 論文リストHTML生成
    let papersHtml = '';
    if (lab.papers && lab.papers.length > 0) {
        papersHtml = '<ul class="list-none">';
        lab.papers.forEach(p => {
            papersHtml += `
                        <li class="mb-[30px] pb-[30px] border-b border-border">
                            <span class="text-[1.2rem] font-bold mb-2.5 block">${p.title}</span>
                            <p class="text-[0.95rem] text-[#555] mb-2.5">${p.summary}</p>
                            <a href="${p.link}" class="text-[0.9rem] text-accent font-bold underline">Read Paper →</a>
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
                <section class="h-[50vh] relative bg-cover bg-center" style="background-image: url('${lab.heroImg}');">
                    <div class="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.7))] flex items-end py-[60px] px-10">
                        <div class="text-white max-w-[1000px] mx-auto w-full">
                            <div class="text-[1.1rem] font-bold opacity-90 mb-2.5">${lab.univ}</div>
                            <h1 class="text-white text-[2.5rem] md:text-[3.5rem] font-extrabold leading-[1.1] mb-5">${lab.name}</h1>
                            <div class="flex gap-2.5 flex-wrap">${tagsHtml}</div>
                        </div>
                    </div>
                </section>

                <div class="max-w-[900px] mx-auto py-20 px-5">
                    
                    <section class="mb-20">
                        <h2 class="text-[1.8rem] font-extrabold mb-10 pb-2.5 border-b-2 border-black inline-block">Basic Information</h2>
                        <div style="text-align:center;">
                            <a href="${lab.website}" target="_blank" class="inline-block bg-text text-white py-[15px] px-10 rounded-full font-bold mb-[50px]">Visit Official Website ↗</a>
                        </div>

                        <div class="flex justify-around flex-wrap gap-10 bg-[#fafafa] p-[50px] rounded-xl">
                            <div class="text-center">
                                <div class="w-[120px] h-[120px] rounded-full mx-auto mb-[15px] relative flex items-center justify-center before:content-[''] before:absolute before:w-[80%] before:h-[80%] before:bg-[#fafafa] before:rounded-full" style="background: conic-gradient(var(--accent) 0% ${st.gender}%, #ddd ${st.gender}% 100%);">
                                    <span class="relative text-[1.5rem] font-extrabold z-[1]">${st.gender}%</span>
                                </div>
                                <div class="font-bold text-[0.9rem] text-[#555]">女性比率</div>
                            </div>
                            <div class="text-center">
                                <div class="w-[120px] h-[120px] rounded-full mx-auto mb-[15px] relative flex items-center justify-center before:content-[''] before:absolute before:w-[80%] before:h-[80%] before:bg-[#fafafa] before:rounded-full" style="background: conic-gradient(var(--accent) 0% ${st.international}%, #ddd ${st.international}% 100%);">
                                    <span class="relative text-[1.5rem] font-extrabold z-[1]">${st.international}%</span>
                                </div>
                                <div class="font-bold text-[0.9rem] text-[#555]">留学生比率</div>
                            </div>
                            <div class="text-center">
                                <div class="w-[120px] h-[120px] rounded-full mx-auto mb-[15px] relative flex items-center justify-center before:content-[''] before:absolute before:w-[80%] before:h-[80%] before:bg-[#fafafa] before:rounded-full" style="background: conic-gradient(var(--accent) 0% ${st.working}%, #ddd ${st.working}% 100%);">
                                    <span class="relative text-[1.5rem] font-extrabold z-[1]">${st.working}%</span>
                                </div>
                                <div class="font-bold text-[0.9rem] text-[#555]">社会人比率</div>
                            </div>
                        </div>
                    </section>

                    <section class="mb-20">
                        <h2 class="text-[1.8rem] font-extrabold mb-10 pb-2.5 border-b-2 border-black inline-block">Research & Papers</h2>
                        <p class="text-[1.1rem] leading-[2] mb-[50px]">${lab.about}</p>
                        
                        <h3 style="font-size:1.2rem; margin-bottom:20px; font-weight:800;">Selected Papers</h3>
                        ${papersHtml}
                    </section>

                    <section class="mb-20">
                        <h2 class="text-[1.8rem] font-extrabold mb-10 pb-2.5 border-b-2 border-black inline-block">Professor's Message</h2>
                        <div class="flex flex-col md:flex-row gap-10 items-center md:items-start bg-white border border-border p-10 rounded-lg text-center md:text-left">
                            <div class="min-w-[150px] mx-auto md:mx-0">
                                <img src="${lab.profImg}" alt="${lab.profName}" class="w-[120px] h-[120px] rounded-full object-cover mb-[15px] border-[3px] border-[#fafafa]">
                                <div class="font-extrabold text-[1.1rem]">${lab.profName}</div>
                            </div>
                            <div class="relative before:content-['“'] before:text-[5rem] before:text-[#eee] before:absolute before:-top-10 before:-left-5 before:z-0 before:font-serif">
                                <p class="relative z-[1] italic text-[1.05rem]">${lab.message}</p>
                            </div>
                        </div>
                    </section>

                    <section class="mb-20">
                        <h2 class="text-[1.8rem] font-extrabold mb-10 pb-2.5 border-b-2 border-black inline-block">Contact</h2>
                        <div class="bg-text text-white p-[50px] rounded-lg text-center">
                            <div style="margin-bottom:20px;">
                                <div class="text-[0.9rem] opacity-80 mb-[5px]">Professor's Email</div>
                                <span class="text-[1.5rem] font-bold mb-[30px] block">${lab.contact.prof}</span>
                            </div>
                            <div>
                                <div class="text-[0.9rem] opacity-80 mb-[5px]">Lab Office / Assistant</div>
                                <span class="text-[1.5rem] font-bold mb-[30px] block">${lab.contact.assistant}</span>
                            </div>
                            <p class="text-[0.8rem] opacity-60">※お問い合わせの際は、件名に「研究室見学希望」等と明記してください。</p>
                        </div>
                    </section>

                </div>
            `;

    document.getElementById('detail-content').innerHTML = html;
};

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
