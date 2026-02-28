
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
        const auth = getAuth(app);
        const db = getFirestore(app);

        // フォーム送信時の処理
        document.getElementById('signup-form').addEventListener('submit', async (e) => {
            e.preventDefault(); // 画面リロードを防ぐ
            
            const btn = document.getElementById('submit-btn');
            btn.disabled = true; // 二重送信防止
            btn.textContent = "登録処理中...";

            // 入力値を取得
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // プロフィール情報
            const profileData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                university: document.getElementById('university').value,
                interest: document.getElementById('interest').value,
                career: document.getElementById('career').value,
                // チェックボックスの値を配列で取得
                themes: Array.from(document.querySelectorAll('.theme-check:checked')).map(cb => cb.value),
                createdAt: new Date()
            };

            try {
                // 1. Firebase Authenticationでユーザー作成 (メアドとパスワード)
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // 2. 作成されたユーザーIDを使って、Firestoreに詳細情報を保存
                // "users" という箱の中に、ユーザーIDの名前でデータを保存
                await setDoc(doc(db, "users", user.uid), profileData);

                // 3. 確認メールを送信 (ご要望機能)
                await sendEmailVerification(user);

                alert("登録が完了しました！\n確認メールを送信しましたので、メールボックスを確認してください。");
                
                // 4. 登録完了後の移動 (トップページへ)
                window.location.href = "index.html";

            } catch (error) {
                console.error("Error:", error);
                let msg = "登録に失敗しました。";
                if (error.code === 'auth/email-already-in-use') {
                    msg = "このメールアドレスは既に登録されています。";
                } else if (error.code === 'auth/weak-password') {
                    msg = "パスワードが弱すぎます（6文字以上にしてください）。";
                }
                alert(msg);
                btn.disabled = false;
                btn.textContent = "同意して登録する";
            }
        });
    