import Script from "next/script";
import Link from "next/link";

export const metadata = {
  title: "決済 | AcadeMina",
};

export default function Page() {
  return (
    <>
      <div className="flex justify-center items-center gap-0 py-5 px-10 bg-white border-b border-border overflow-x-auto whitespace-nowrap md:overflow-visible">
        <div className="flex items-center gap-2 text-[0.75rem] md:text-[0.9rem] font-semibold text-text"><span className="w-7 h-7 rounded-full border-2 border-text bg-text text-white flex items-center justify-center text-[0.8rem] font-bold">✓</span> カート</div>
        <div className="w-[30px] md:w-[60px] h-[2px] bg-text mx-2.5"></div>
        <div className="flex items-center gap-2 text-[0.75rem] md:text-[0.9rem] font-semibold text-accent"><span className="w-7 h-7 rounded-full border-2 border-accent bg-accent text-white flex items-center justify-center text-[0.8rem] font-bold">2</span> 決済情報</div>
        <div className="w-[30px] md:w-[60px] h-[2px] bg-[#ddd] mx-2.5"></div>
        <div className="flex items-center gap-2 text-[0.75rem] md:text-[0.9rem] font-semibold text-[#999]"><span className="w-7 h-7 rounded-full border-2 border-[#ddd] flex items-center justify-center text-[0.8rem] font-bold">3</span> 完了</div>
      </div>
      <div className="flex flex-col md:flex-row max-w-[1100px] mx-auto my-[30px] px-5 gap-[30px] items-start">
        <div className="flex-1 min-w-0 w-full">
          <div className="bg-white border border-border rounded-xl p-[30px] mb-5">
            <h2 className="text-[1.1rem] font-extrabold mb-5 pb-2.5 border-b-2 border-text">お支払い方法</h2>
            <div className="flex flex-col gap-2.5 mb-[25px]">
              <label className="flex items-center gap-3 p-[15px] border-2 border-accent rounded-lg cursor-pointer transition-colors hover:border-[#bbb] bg-[#f5f8ff]">
                <input defaultChecked name="pay" type="radio" value="card" className="accent-accent" />
                <span className="font-semibold text-[0.95rem]">クレジットカード</span>
                <div className="ml-auto flex gap-1"><span className="bg-[#eee] px-2 py-1 rounded text-[0.7rem] font-bold text-[#555]">VISA</span><span className="bg-[#eee] px-2 py-1 rounded text-[0.7rem] font-bold text-[#555]">MC</span><span className="bg-[#eee] px-2 py-1 rounded text-[0.7rem] font-bold text-[#555]">AMEX</span></div>
              </label>
              <label className="flex items-center gap-3 p-[15px] border-2 border-border rounded-lg cursor-pointer transition-colors hover:border-[#bbb]">
                <input name="pay" type="radio" value="gpay" className="accent-accent" />
                <span className="font-semibold text-[0.95rem]">Google Pay</span>
              </label>
              <label className="flex items-center gap-3 p-[15px] border-2 border-border rounded-lg cursor-pointer transition-colors hover:border-[#bbb]">
                <input name="pay" type="radio" value="applepay" className="accent-accent" />
                <span className="font-semibold text-[0.95rem]">Apple Pay</span>
              </label>
            </div>
            <div className="bg-gray border-2 border-dashed border-border rounded-lg p-[30px] text-center text-[#999] text-[0.9rem] mb-5" id="stripe-area">
              <strong className="text-text block mb-1">Stripe決済フォーム埋め込みエリア</strong>
              ここにStripe Elements（カード番号・有効期限・CVC）が挿入されます。<br />
              実装時は <code className="bg-[#eee] px-1 py-0.5 rounded">stripe.js</code> を読み込み、<code className="bg-[#eee] px-1 py-0.5 rounded">Elements</code> をマウントします。
            </div>
          </div>
          <div className="bg-white border border-border rounded-xl p-[30px] mb-5" id="profile-section">
            <h2 className="text-[1.1rem] font-extrabold mb-5 pb-2.5 border-b-2 border-text">ご登録情報</h2>
            <div id="profile-display" style={{ display: 'none' }}>
              <div className="flex justify-between py-2.5 border-b border-[#f0f0f0] text-[0.9rem]"><span className="text-[#888] font-semibold">氏名</span><span className="font-semibold" id="prof-name"></span></div>
              <div className="flex justify-between py-2.5 border-b border-[#f0f0f0] text-[0.9rem]"><span className="text-[#888] font-semibold">メールアドレス</span><span className="font-semibold" id="prof-email"></span></div>
              <div className="flex justify-between py-2.5 border-b border-[#f0f0f0] text-[0.9rem]"><span className="text-[#888] font-semibold">所属</span><span className="font-semibold" id="prof-univ"></span></div>
              <p className="mt-[15px] text-[0.8rem] text-[#999]">※ マイページで登録済みの情報を表示しています。<Link href="/mypage" className="text-accent underline text-accent underline">変更する</Link></p>
            </div>
            <div id="profile-form">
              <p className="mb-5 text-[0.9rem] text-[#555]">購入に必要な情報を入力してください。</p>
              <div className="mb-[18px]">
                <label className="block text-[0.85rem] font-bold mb-1.5 text-[#444]">氏名 <span className="text-[#ff4757]">*</span></label>
                <input className="w-full px-[15px] py-3 border border-border rounded-lg text-[0.95rem] font-sans outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,68,204,0.08)] transition-colors" id="input-name" placeholder="例：山田 太郎" required type="text" />
              </div>
              <div className="mb-[18px]">
                <label className="block text-[0.85rem] font-bold mb-1.5 text-[#444]">メールアドレス <span className="text-[#ff4757]">*</span></label>
                <input className="w-full px-[15px] py-3 border border-border rounded-lg text-[0.95rem] font-sans outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,68,204,0.08)] transition-colors" id="input-email" placeholder="例：yamada@example.com" required type="email" />
              </div>
              <div className="mb-[18px]">
                <label className="block text-[0.85rem] font-bold mb-1.5 text-[#444]">所属（大学・学部・学年）</label>
                <input className="w-full px-[15px] py-3 border border-border rounded-lg text-[0.95rem] font-sans outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,68,204,0.08)] transition-colors" id="input-univ" placeholder="例：〇〇大学 理工学部 3年" type="text" />
              </div>
              <label className="flex items-center gap-2 mt-2.5 text-[0.85rem] text-[#555] cursor-pointer">
                <input defaultChecked id="save-profile" className="accent-accent mt-[3px]" type="checkbox" /> この情報をマイページに保存する
              </label>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[360px] shrink-0 md:sticky md:top-[100px]">
          <div className="bg-white border border-border rounded-xl p-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="text-[1rem] font-extrabold mb-[15px]">注文内容</div>
            <div id="summary-items"></div>
            <div className="flex justify-between text-[1.3rem] font-extrabold pt-[15px] mt-[10px] border-t-2 border-text text-[1.3rem] font-extrabold pt-[15px] mt-[10px] border-t-2 border-text"><span>合計（税込）</span><span id="summary-total">¥0</span></div>
            <div className="flex items-start gap-2.5 my-5 text-[0.85rem] text-[#666]">
              <input id="terms-agree" type="checkbox" className="mt-[3px] accent-accent" />
              <span><Link href="/legal" className="text-accent underline">利用規約</Link>および<Link href="/legal" className="text-accent underline">プライバシーポリシー</Link>に同意する</span>
            </div>
            <button className="block w-full p-4 bg-accent text-white border-none rounded-full text-[1.1rem] font-bold cursor-pointer transition-all duration-200 hover:bg-[#003399] hover:-translate-y-[1px] disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:transform-none" disabled id="pay-btn">¥0 を支払って購入を確定する</button>
          </div>
        </div>
      </div>

      <Script src="/store-data.js" strategy="afterInteractive" />
      <Script src="/scripts/checkout__inline1.js" strategy="afterInteractive" />
    </>
  );
}
