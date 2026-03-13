import Link from "next/link";
import Script from "next/script";

export const metadata = {
  title: "購入完了 | AcadeMina",
};

export default function Page() {
  return (
    <>
      <div className="flex justify-center items-center gap-0 py-5 px-10 bg-white border-b border-border">
        <div className="flex items-center gap-2 text-[0.75rem] md:text-[0.9rem] font-semibold text-text"><span className="w-7 h-7 rounded-full border-2 border-text bg-text text-white flex items-center justify-center text-[0.8rem] font-bold">✓</span> カート</div>
        <div className="w-[30px] md:w-[60px] h-[2px] bg-accent mx-2.5"></div>
        <div className="flex items-center gap-2 text-[0.75rem] md:text-[0.9rem] font-semibold text-text"><span className="w-7 h-7 rounded-full border-2 border-text bg-text text-white flex items-center justify-center text-[0.8rem] font-bold">✓</span> 決済情報</div>
        <div className="w-[30px] md:w-[60px] h-[2px] bg-accent mx-2.5"></div>
        <div className="flex items-center gap-2 text-[0.75rem] md:text-[0.9rem] font-semibold text-text"><span className="w-7 h-7 rounded-full border-2 border-text bg-text text-white flex items-center justify-center text-[0.8rem] font-bold">✓</span> 完了</div>
      </div>
      <div className="max-w-[700px] mx-auto my-[50px] px-5">
        <div className="bg-white rounded-2xl p-10 md:p-[60px_50px] text-center border border-border shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="w-[80px] h-[80px] rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] flex items-center justify-center mx-auto mb-[25px] text-[2.5rem] text-white animate-[popIn_0.5s_ease] shadow-[0_4px_15px_rgba(0,102,255,0.3)]">✓</div>
          <h1 className="text-[1.5rem] md:text-[2rem] font-extrabold mb-2.5">ご購入ありがとうございます！</h1>
          <p className="text-[1.05rem] text-[#555] mb-[30px] leading-[1.8]">決済が正常に完了しました。<br />教材のダウンロードが可能です。</p>
          <div className="inline-block bg-gray px-[25px] py-2.5 rounded-lg text-[0.95rem] font-bold mb-[35px] tracking-[0.03em]">注文番号: <span id="order-number" className="text-accent">AM-000000</span></div>
          <div className="bg-[#f5f8ff] border-2 border-[#d6e4ff] rounded-xl p-[30px] mb-[30px] text-left text-text">
            <div className="text-[1.1rem] font-extrabold mb-[15px]">購入した教材</div>
            <div id="download-items"></div>
          </div>
          <div className="bg-gray px-5 py-[15px] rounded-lg text-[0.9rem] text-[#555] mb-[25px] flex items-center gap-2.5 text-left flex-wrap md:flex-nowrap">
            <span className="text-[1.2rem] shrink-0">📧</span>
            <span className="flex-1">ご登録のメールアドレスにもダウンロードURLをお送りしました。<br /><strong className="text-text">メールが届かない場合は迷惑メールフォルダをご確認ください。</strong></span>
          </div>
          <div className="flex flex-col md:flex-row gap-[15px] justify-center items-center flex-wrap">
            <Link className="inline-block w-full md:w-auto px-[36px] py-[14px] bg-text text-white rounded-full font-bold text-[0.95rem] transition-all duration-200 hover:bg-accent" href="/mypage">マイページで確認する</Link>
            <Link className="inline-block w-full md:w-auto px-[36px] py-[14px] bg-transparent border border-border rounded-full font-bold text-[0.95rem] transition-all duration-200 hover:border-accent hover:text-accent" href="/exam-store">教材ストアに戻る</Link>
          </div>
        </div>
      </div>
      <div className="max-w-[700px] mx-auto my-[50px] px-5">
        <div className="text-[1.2rem] font-extrabold mb-5 flex flex-wrap md:flex-nowrap items-center gap-2.5">こちらもおすすめ <span className="text-[0.75rem] font-semibold text-[#999] bg-gray px-2.5 py-[3px] rounded">この教材を買った人は掲示板も見ています</span></div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[15px]" id="crosssell-grid"></div>
      </div>

      <Script src="/store-data.js" strategy="afterInteractive" />
      <Script src="/scripts/order-complete__inline1.js" strategy="afterInteractive" />
    </>
  );
}
