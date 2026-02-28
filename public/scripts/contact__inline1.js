
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

        // ★★★ ここを書き換える！(lab.htmlと同じもの) ★★★
        const firebaseConfig = {
            apiKey: "AIzaSyDBGqCJcMayd_2AEMW00HB-guXKrsCeVnM", 
            authDomain: "academina-db.firebaseapp.com",
            projectId: "academina-db",
            storageBucket: "academina-db.firebasestorage.app",
            messagingSenderId: "557070321508",
            appId: "1:557070321508:web:03bb7de1ad2a3779d1dc71"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // 送信処理
        document.getElementById('contact-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('submit-btn');
            btn.disabled = true;
            btn.innerText = "送信中...";

            // データの取得
            const type = document.querySelector('input[name="type"]:checked').value;
            const name = document.getElementById('name').value;
            const affiliation = document.getElementById('affiliation').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            try {
                // "contacts" というコレクションに追加
                await addDoc(collection(db, "contacts"), {
                    type: type,
                    name: name,
                    affiliation: affiliation,
                    email: email,
                    phone: phone,
                    subject: subject,
                    message: message,
                    createdAt: new Date(),
                    status: "unread" // 未読ステータス
                });

                alert("お問い合わせを受け付けました。\n担当者よりご連絡いたします。");
                document.getElementById('contact-form').reset(); // フォームを空にする

            } catch (error) {
                console.error("Error:", error);
                alert("送信に失敗しました。時間をおいて再度お試しください。");
            } finally {
                btn.disabled = false;
                btn.innerText = "送信する";
            }
        });
    