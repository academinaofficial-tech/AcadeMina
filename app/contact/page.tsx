"use client";

import { useState } from "react";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止
    
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
      // ★デプロイした最新のGAS URLをここに貼り付け
      const GAS_URL = "https://script.google.com/macros/s/AKfycbyOzef13JJVPFbjPcCz0rQeC9avtKx1ZkbGJ6___Ww8KgQ0pyrQVmMrc_WISQvFkNoU/exec";
      
      const queryString = new URLSearchParams(data as any).toString();

      // POST送信に変更（リロードによる再送を防止）
      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: queryString,
      });

      alert("送信が完了しました。お問い合わせありがとうございます。");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error:", error);
      alert("送信中にエラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mt-20 md:mt-[134px] bg-[#fdfdfd] pb-20">
      <div className="py-20 px-5 text-center bg-white border-b border-border">
        <h1 className="text-[2.5rem] font-extrabold mb-[15px] tracking-wider">Contact Us</h1>
        <p className="text-[1rem] text-[#666] max-w-[600px] mx-auto">
          サービスに関するご質問、研究室掲載のご依頼、<br />
          大学・企業様からの提携に関するお問い合わせはこちらから承ります。
        </p>
      </div>

      <div className="flex justify-center w-full">
        <div className="w-full max-w-[800px] my-[60px] bg-white p-[50px] rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.05)] md:p-[30px_20px] md:mx-[20px]">
          <form onSubmit={handleSubmit}>
            <div className="mb-[30px]">
              <label className="flex items-center font-bold text-[0.95rem] mb-2.5">
                お問い合わせの種類 <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span>
              </label>
              <div className="flex flex-wrap gap-[15px]">
                {[
                  { id: "student", label: "学生として" },
                  { id: "lab", label: "研究室・教員として" },
                  { id: "univ_corp", label: "大学・企業として" },
                  { id: "other", label: "その他" },
                ].map((item, i) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer py-2.5 px-5 border border-border rounded-full text-[0.9rem] transition-colors duration-200 hover:bg-[#f0f0f0]">
                    <input
                      defaultChecked={i === 0}
                      className="accent-accent peer"
                      name="type"
                      required
                      type="radio"
                      value={item.id}
                    />
                    <span className="peer-checked:font-bold peer-checked:text-accent">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-5 md:flex-col md:gap-0">
              <div className="flex-1 mb-[30px]">
                <label className="flex items-center font-bold text-[0.95rem] mb-2.5">氏名 <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span></label>
                <input className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-accent focus:bg-white focus:outline-none" name="name" required placeholder="山田 太郎" />
              </div>
              <div className="flex-1 mb-[30px]">
                <label className="flex items-center font-bold text-[0.95rem] mb-2.5">所属 <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span></label>
                <input className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-accent focus:bg-white focus:outline-none" name="affiliation" required placeholder="〇〇大学" />
              </div>
            </div>

            <div className="mb-[30px]">
              <label className="flex items-center font-bold text-[0.95rem] mb-2.5">メールアドレス <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span></label>
              <input className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-accent focus:bg-white focus:outline-none" name="email" type="email" required placeholder="your@email.com" />
            </div>

            <div className="mb-[30px]">
              <label className="flex items-center font-bold text-[0.95rem] mb-2.5">電話番号 <span className="bg-[#999] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">任意</span></label>
              <input className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-accent focus:bg-white focus:outline-none" name="phone" placeholder="090-1234-5678" />
            </div>

            <div className="mb-[30px]">
              <label className="flex items-center font-bold text-[0.95rem] mb-2.5">件名 <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span></label>
              <input className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-accent focus:bg-white focus:outline-none" name="subject" required />
            </div>

            <div className="mb-[30px]">
              <label className="flex items-center font-bold text-[0.95rem] mb-2.5">お問い合わせ内容 <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span></label>
              <textarea className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] focus:border-accent focus:bg-white focus:outline-none h-[200px] resize-y" name="message" required></textarea>
            </div>

            <div className="mb-[30px]">
              <label className="flex items-center cursor-pointer text-[0.9rem] text-[#666]">
                <input name="privacy" required className="mr-2.5" type="checkbox" />
                プライバシーポリシーに同意する
              </label>
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full p-[18px] bg-[#2d2f31] text-white rounded-full text-[1.1rem] font-bold transition-all hover:bg-[#0044cc] disabled:bg-[#ccc]" 
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