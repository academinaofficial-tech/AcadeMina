"use client";

import { useState } from "react";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信を徹底ガード
    
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      type: formData.get("type"),
      name: formData.get("name"),
      affiliation: formData.get("affiliation"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      // 最新のGASデプロイURL
      const GAS_URL = "https://script.google.com/macros/s/AKfycbyOzef13JJVPFbjPcCz0rQeC9avtKx1ZkbGJ6___Ww8KgQ0pyrQVmMrc_WISQvFkNoU/exec";
      
      const queryString = new URLSearchParams(data as any).toString();

      // リロードによる再送を防ぐためPOSTで送信
      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: queryString,
      });

      alert("送信が完了しました。お問い合わせありがとうございます。");
      (e.target as HTMLFormElement).reset(); // フォームを空にする
    } catch (error) {
      console.error("Submission error:", error);
      alert("送信中にエラーが発生しました。時間を置いて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mt-20 md:mt-[134px] bg-[#fdfdfd] pb-20">
      {/* ヘッダーセクション：Aboutページ同様、text-centerを徹底 */}
      <div className="py-20 px-5 text-center bg-white border-b border-border">
        <h1 className="text-[2.5rem] font-extrabold mb-[15px] tracking-wider">Contact Us</h1>
        <p className="text-[1rem] text-[#666] max-w-[600px] mx-auto text-center leading-[1.8]">
          サービスに関するご質問、希望コンテンツの掲載依頼、<br />
          大学・企業様からの提携に関するお問い合わせはこちらから承ります。
        </p>
      </div>

      {/* フォームコンテナ：中央揃えを確実にするためのflex */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-[800px] my-[60px] bg-white p-[50px] rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.05)] md:p-[30px_20px] md:mx-[20px]">
          <form onSubmit={handleSubmit}>
            
            {/* 1. お問い合わせの種類 */}
            <div className="mb-[40px]">
              <label className="flex items-center font-bold text-[0.95rem] mb-4">
                お問い合わせの種類 <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2 font-normal">必須</span>
              </label>
              <div className="flex flex-wrap gap-[12px]">
                {[
                  { id: "student", label: "学生として" },
                  { id: "lab", label: "研究室・教員として" },
                  { id: "univ_corp", label: "大学・企業として" },
                  { id: "other", label: "その他" },
                ].map((item, i) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer py-2.5 px-6 border border-border rounded-full text-[0.9rem] transition-all hover:bg-[#f8f9fa] peer-checked:bg-accent">
                    <input
                      defaultChecked={i === 0}
                      className="accent-[#0044cc] peer"
                      name="type"
                      required
                      type="radio"
                      value={item.id}
                    />
                    <span className="peer-checked:font-bold peer-checked:text-[#0044cc]">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. 氏名・所属（横並び） */}
            <div className="flex gap-6 md:flex-col md:gap-0">
              <div className="flex-1 mb-[30px]">
                <label className="block font-bold text-[0.95rem] mb-2.5">氏名 <span className="text-[#ff4757] ml-1">＊</span></label>
                <input className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-[#0044cc] focus:bg-white focus:outline-none transition-all" name="name" required placeholder="山田 太郎" />
              </div>
              <div className="flex-1 mb-[30px]">
                <label className="block font-bold text-[0.95rem] mb-2.5">所属（大学・企業名） <span className="text-[#ff4757] ml-1">＊</span></label>
                <input className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-[#0044cc] focus:bg-white focus:outline-none transition-all" name="affiliation" required placeholder="〇〇大学" />
              </div>
            </div>

            {/* 3. メールアドレス */}
            <div className="mb-[30px]">
              <label className="block font-bold text-[0.95rem] mb-2.5">メールアドレス <span className="text-[#ff4757] ml-1">＊</span></label>
              <input className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-[#0044cc] focus:bg-white focus:outline-none transition-all" name="email" type="email" required placeholder="your@email.com" />
            </div>

            {/* 4. 電話番号（任意） */}
            <div className="mb-[30px]">
              <label className="block font-bold text-[0.95rem] mb-2.5">電話番号 <span className="text-[#999] text-[0.75rem] font-normal ml-2">(任意)</span></label>
              <input className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-[#0044cc] focus:bg-white focus:outline-none transition-all" name="phone" placeholder="090-1234-5678" />
            </div>

            {/* 5. 件名 */}
            <div className="mb-[30px]">
              <label className="block font-bold text-[0.95rem] mb-2.5">件名 <span className="text-[#ff4757] ml-1">＊</span></label>
              <input className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-[#0044cc] focus:bg-white focus:outline-none transition-all" name="subject" required placeholder="お問い合わせ内容の要約" />
            </div>

            {/* 6. 本文 */}
            <div className="mb-[30px]">
              <label className="block font-bold text-[0.95rem] mb-2.5">お問い合わせ内容 <span className="text-[#ff4757] ml-1">＊</span></label>
              <textarea className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-[#0044cc] focus:bg-white focus:outline-none h-[200px] resize-y transition-all" name="message" required placeholder="詳細をご記入ください。"></textarea>
            </div>

            {/* 7. プライバシー同意 */}
            <div className="mb-[40px] flex justify-center">
              <label className="flex items-center cursor-pointer text-[0.9rem] text-[#666] hover:text-black transition-colors">
                <input name="privacy" required className="mr-3 w-4 h-4 accent-[#0044cc]" type="checkbox" />
                <span>プライバシーポリシーに同意する</span>
              </label>
            </div>

            {/* 送信ボタン：ホバーアニメーション付き */}
            <button 
              disabled={isSubmitting}
              className="w-full p-[20px] bg-[#2d2f31] text-white rounded-full text-[1.1rem] font-bold transition-all duration-300 hover:bg-[#0044cc] hover:-translate-y-[2px] hover:shadow-[0_10px_20px_rgba(0,68,204,0.2)] disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:transform-none" 
              type="submit"
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}