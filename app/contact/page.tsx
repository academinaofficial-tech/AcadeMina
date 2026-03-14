import Script from "next/script";

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
    <main className="mt-20 md:mt-[134px]">
      {/* 
        Removed header & footer which were rendered in the page explicitly.
        They are now handled by layout.tsx 
      */}
      <div className="py-20 px-5 text-center bg-white border-b border-border">
        <h1 className="text-[2.5rem] font-extrabold mb-[15px] tracking-wider">Contact Us</h1>
        <p className="text-[1rem] text-[#666] max-w-[600px] mx-auto">
          サービスに関するご質問、研究室掲載のご依頼、<br />
          大学・企業様からの提携に関するお問い合わせはこちらから承ります。
        </p>
      </div>

      <div className="max-w-[800px] mx-auto my-[60px] bg-white p-[50px] rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.05)] md:p-[30px_20px] md:m-[30px_20px]">
        <form id="contact-form">
          <div className="mb-[30px]">
            <label className="flex items-center font-bold text-[0.95rem] mb-2.5">
              お問い合わせの種類 <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span>
            </label>
            <div className="flex flex-wrap gap-[15px]">
              <label className="flex items-center gap-2 cursor-pointer py-2.5 px-5 border border-border rounded-full text-[0.9rem] transition-colors duration-200 hover:bg-[#f0f0f0]">
                <input
                  defaultChecked
                  className="accent-accent peer"
                  name="type"
                  required
                  type="radio"
                  value="student"
                />{" "}
                <span className="peer-checked:font-bold peer-checked:text-accent">学生として</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer py-2.5 px-5 border border-border rounded-full text-[0.9rem] transition-colors duration-200 hover:bg-[#f0f0f0]">
                <input className="accent-accent peer" name="type" type="radio" value="lab" />{" "}
                <span className="peer-checked:font-bold peer-checked:text-accent">研究室・教員として</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer py-2.5 px-5 border border-border rounded-full text-[0.9rem] transition-colors duration-200 hover:bg-[#f0f0f0]">
                <input
                  className="accent-accent peer"
                  name="type"
                  type="radio"
                  value="univ_corp"
                />{" "}
                <span className="peer-checked:font-bold peer-checked:text-accent">大学・企業として</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer py-2.5 px-5 border border-border rounded-full text-[0.9rem] transition-colors duration-200 hover:bg-[#f0f0f0]">
                <input className="accent-accent peer" name="type" type="radio" value="other" />{" "}
                <span className="peer-checked:font-bold peer-checked:text-accent">その他</span>
              </label>
            </div>
          </div>

          <div className="flex gap-5 md:flex-col md:gap-0">
            <div className="flex-1 mb-[30px]">
              <label className="flex items-center font-bold text-[0.95rem] mb-2.5">
                氏名 <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span>
              </label>
              <input
                className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] transition-all duration-300 focus:border-accent focus:bg-white focus:outline-none"
                id="name"
                placeholder="山田 太郎"
                required
                type="text"
              />
            </div>
            <div className="flex-1 mb-[30px]">
              <label className="flex items-center font-bold text-[0.95rem] mb-2.5">
                所属（大学・企業名） <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span>
              </label>
              <input
                className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] transition-all duration-300 focus:border-accent focus:bg-white focus:outline-none"
                id="affiliation"
                placeholder="〇〇大学 / 株式会社〇〇"
                required
                type="text"
              />
            </div>
          </div>

          <div className="mb-[30px]">
            <label className="flex items-center font-bold text-[0.95rem] mb-2.5">
              メールアドレス <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span>
            </label>
            <input
              className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] transition-all duration-300 focus:border-accent focus:bg-white focus:outline-none"
              id="email"
              placeholder="yourname@example.com"
              required
              type="email"
            />
          </div>

          <div className="mb-[30px]">
            <label className="flex items-center font-bold text-[0.95rem] mb-2.5">
              電話番号 <span className="bg-[#999] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">任意</span>
            </label>
            <input
              className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] transition-all duration-300 focus:border-accent focus:bg-white focus:outline-none"
              id="phone"
              placeholder="090-1234-5678"
              type="tel"
            />
          </div>

          <div className="mb-[30px]">
            <label className="flex items-center font-bold text-[0.95rem] mb-2.5">
              件名 <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span>
            </label>
            <input
              className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] transition-all duration-300 focus:border-accent focus:bg-white focus:outline-none"
              id="subject"
              placeholder="例：研究室情報の掲載について"
              required
              type="text"
            />
          </div>

          <div className="mb-[30px]">
            <label className="flex items-center font-bold text-[0.95rem] mb-2.5">
              お問い合わせ内容 <span className="bg-[#ff4757] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[3px] ml-2">必須</span>
            </label>
            <textarea
              className="w-full p-[15px] text-[1rem] border border-border rounded bg-[#fafafa] transition-all duration-300 focus:border-accent focus:bg-white focus:outline-none h-[200px] resize-y"
              id="message"
              placeholder="詳細をご記入ください。"
              required
            ></textarea>
          </div>

          <div style={{ marginBottom: 30 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              <input
                id="privacy"
                required
                style={{ marginRight: 10 }}
                type="checkbox"
              />
              <span style={{ color: "#666" }}>プライバシーポリシーに同意する</span>
            </label>
          </div>

          <button className="w-full p-[18px] bg-text text-white border-none rounded-full text-[1.1rem] font-bold cursor-pointer transition-all duration-300 hover:bg-accent hover:-translate-y-[2px] hover:shadow-[0_5px_15px_rgba(0,68,204,0.3)] disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" id="submit-btn" type="submit">
            送信する
          </button>
        </form>
      </div>

      <Script src="/scripts/contact__inline1.js" type="module" strategy="afterInteractive" />
    </main>
  );
}