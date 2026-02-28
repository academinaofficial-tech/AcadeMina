/* =========================================
   News Data (お知らせ・記事データベース)
   ========================================= */

const newsData = [
    {
        id: "20251201_utokyo", // URLになるID
        date: "2025.12.01",
        category: "Update",
        title: "東京大学 大学院工学系研究科の募集要項データベースを更新しました",
        
        // ▼▼ ここに本文を書く（改行してもOK） ▼▼
        body: `
            <p>AcadeMinaをご利用いただきありがとうございます。<br>
            本日、東京大学大学院 工学系研究科の2026年度（令和8年度）入試に対応した最新の募集要項データを反映いたしました。</p>
            
            <h3>主な更新内容</h3>
            <ul>
                <li>一般選抜のスケジュール更新</li>
                <li>英語スコア（TOEFL）の提出期限の変更点</li>
                <li>各専攻の定員情報の修正</li>
            </ul>
            
            <p>特に英語スコアの提出方法については、昨年から変更が生じている専攻がありますので、受験予定の方は必ず詳細をご確認ください。</p>
            <p>引き続き、AcadeMinaをよろしくお願いいたします。</p>
        `,
        
        url: "news-detail.html?id=20251201_utokyo" // 詳細ページへのリンク
    },
    {
        id: "20251120_webinar",
        date: "2025.11.20",
        category: "Event",
        title: "【無料ウェビナー】春休みから始める院試英語対策（TOEFL/TOEIC）",
        
        body: `
            <p>これから大学院入試の対策を始める学部3年生・2年生を対象に、無料のオンラインセミナーを開催します。</p>
            
            <h3>イベント概要</h3>
            <p>
                <strong>日時：</strong> 2025年12月15日（土） 19:00〜20:30<br>
                <strong>場所：</strong> Zoom（オンライン）<br>
                <strong>参加費：</strong> 無料
            </p>
            
            <h3>当日のプログラム</h3>
            <ol>
                <li>院試における英語の重要性とスコアの目安</li>
                <li>TOEFL iBT と TOEIC L&R の違いと選び方</li>
                <li>3ヶ月でスコアを100点伸ばす学習計画</li>
                <li>質疑応答</li>
            </ol>
            
            <p>参加ご希望の方は、以下のフォームよりお申し込みください。</p>
            <div style="text-align:center; margin:30px 0;">
                <a href="#" style="background:#0044cc; color:#fff; padding:15px 30px; text-decoration:none; border-radius:50px; font-weight:bold;">ウェビナーに申し込む</a>
            </div>
        `,
        
        url: "news-detail.html?id=20251120_webinar"
    },
    {
        id: "20251110_maintenance",
        date: "2025.11.10",
        category: "Info",
        title: "サイトメンテナンスのお知らせ（11/15 深夜2:00〜）",
        body: `
            <p>サーバー強化に伴うメンテナンスのため、以下の日程でサービスを一時停止させていただきます。</p>
            <p><strong>日時：</strong> 11月15日（水） AM 2:00 〜 AM 5:00</p>
            <p>ご不便をおかけしますが、ご理解のほどよろしくお願いいたします。</p>
        `,
        url: "news-detail.html?id=20251110_maintenance"
    }
];