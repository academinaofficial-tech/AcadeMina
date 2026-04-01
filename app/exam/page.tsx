import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大学院受験サポート｜院試対策の始め方から合格戦略までAcadeMinaで整理",
  description:
    "院試対策を何から始めるべきか迷う方へ。AcadeMinaの院試サポートでは、過去問、体験記、研究計画書、情報収集の進め方まで、大学院受験の全体像をわかりやすく整理できます。",
};

export default function Page() {
  return (
    <>
      {/* 幾何学模様の背景装飾 */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden before:content-[''] before:absolute before:-top-[10%] before:-right-[5%] before:w-[700px] before:h-[700px] before:rounded-full before:bg-[radial-gradient(circle,rgba(0,68,204,0.07)_0%,transparent_70%)] after:content-[''] after:absolute after:-bottom-[15%] after:-left-[10%] after:w-[800px] after:h-[800px] after:rounded-full after:bg-[radial-gradient(circle,rgba(77,166,255,0.06)_0%,transparent_70%)]"></div>
      <svg className="fixed -z-10 pointer-events-none w-full h-full" style={{ top: '5%', left: '-5%', width: 500, height: 500, opacity: .12 }} viewBox="0 0 500 500">
        <polygon fill="none" points="250,30 470,180 390,430 110,430 30,180" stroke="#0044cc" strokeWidth="1.5"></polygon>
        <polygon fill="none" points="250,80 420,200 360,390 140,390 80,200" stroke="#4da6ff" strokeWidth="1"></polygon>
        <polygon fill="none" points="250,130 370,220 330,350 170,350 130,220" stroke="#0044cc" strokeWidth=".8"></polygon>
      </svg>
      <svg className="fixed -z-10 pointer-events-none w-full h-full" style={{ top: '30%', right: '-8%', width: 600, height: 600, opacity: .08 }} viewBox="0 0 600 600">
        <circle cx="300" cy="300" fill="none" r="280" stroke="#0044cc" strokeWidth="1"></circle>
        <circle cx="300" cy="300" fill="none" r="220" stroke="#4da6ff" strokeWidth=".8"></circle>
        <circle cx="300" cy="300" fill="none" r="160" stroke="#0044cc" strokeWidth=".6"></circle>
        <line stroke="#4da6ff" strokeWidth=".4" x1="20" x2="580" y1="300" y2="300"></line>
        <line stroke="#4da6ff" strokeWidth=".4" x1="300" x2="300" y1="20" y2="580"></line>
        <line stroke="#0044cc" strokeWidth=".3" x1="80" x2="520" y1="80" y2="520"></line>
        <line stroke="#0044cc" strokeWidth=".3" x1="520" x2="80" y1="80" y2="520"></line>
      </svg>
      <svg className="fixed -z-10 pointer-events-none w-full h-full" style={{ bottom: '5%', left: '5%', width: 400, height: 400, opacity: .1 }} viewBox="0 0 400 400">
        <rect fill="none" height="300" stroke="#0044cc" strokeWidth="1" transform="rotate(15,200,200)" width="300" x="50" y="50"></rect>
        <rect fill="none" height="240" stroke="#4da6ff" strokeWidth=".8" transform="rotate(30,200,200)" width="240" x="80" y="80"></rect>
        <rect fill="none" height="180" stroke="#0044cc" strokeWidth=".6" transform="rotate(45,200,200)" width="180" x="110" y="110"></rect>
      </svg>
      <svg className="fixed -z-10 pointer-events-none w-full h-full" style={{ top: '60%', right: '10%', width: 300, height: 300, opacity: .06 }} viewBox="0 0 300 300">
        <path d="M150 10 L280 90 L250 240 L50 240 L20 90 Z" fill="none" stroke="#0044cc" strokeWidth="1.5"></path>
        <path d="M150 50 L240 110 L220 210 L80 210 L60 110 Z" fill="none" stroke="#4da6ff" strokeWidth="1"></path>
      </svg>

      {/* Hero Section */}
      <section className="mt-20 md:mt-[134px] pt-[80px] md:pt-[120px] px-5 md:px-10 pb-[60px] md:pb-[100px] text-center relative overflow-hidden bg-[linear-gradient(135deg,#e8efff_0%,#d0dfff_30%,#e0eaff_60%,#f0f4ff_100%)] before:content-[''] before:absolute before:-top-[30%] before:-right-[10%] before:w-[500px] before:h-[500px] before:rounded-full before:bg-[radial-gradient(circle,rgba(0,68,204,0.1),transparent_70%)] after:content-[''] after:absolute after:-bottom-[20%] after:-left-[10%] after:w-[400px] after:h-[400px] after:rounded-full after:bg-[radial-gradient(circle,rgba(77,166,255,0.08),transparent_70%)]">
        <div className="text-[0.9rem] font-bold text-accent tracking-[0.15em] uppercase mb-5 relative">Exam Support / 院試サポート</div>
        <h1 className="text-[2.2rem] md:text-[3.5rem] font-extrabold leading-[1.2] mb-[25px] relative">院試突破のすべてを、<br />ここに。</h1>
        <p className="text-[1.15rem] text-[#555] max-w-[600px] mx-auto relative leading-[1.9]">過去問の解答解説から、合格者との1on1メンタリングまで。<br />院試に挑戦するあなたを、4つのサービスで全方位サポートします。</p>
      </section>

      {/* 01: 教材ストア (画像 右) */}
      <div className="flex flex-col md:flex-row items-center gap-[40px] md:gap-[80px] max-w-[1100px] mx-auto py-[60px] md:py-[120px] px-5 md:px-10 border-t border-border first:border-t-0">
        <div className="flex-1">
          <div className="text-[0.8rem] font-bold text-accent-light tracking-[0.15em] uppercase mb-3">01 / Digital Store</div>
          <h2 className="text-[1.8rem] md:text-[2.5rem] font-extrabold mb-5 leading-[1.2]">院試マスター / 教材ストア</h2>
          <p className="text-[1.05rem] text-[#555] leading-[2] mb-[30px]">合格者が執筆した過去問解説、体験記、研究計画書、予想問題。<br />大学院入試を突破するための「武器」を、いつでも手に入れられます。</p>
          <Link className="inline-block px-[36px] py-[14px] bg-text text-white rounded-full font-bold text-[0.95rem] transition-all duration-300 hover:bg-accent hover:opacity-100 hover:-translate-y-[2px]" href="/exam-store">教材を探す →</Link>
        </div>
        <div className="flex-1 relative w-full">
          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-gray">
            <img className="w-full h-full object-cover" alt="教材ストア" src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop" />
          </div>
        </div>
      </div>

      {/* 02: 合格体験記 [NEW] (画像 左) */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-[40px] md:gap-[80px] max-w-[1100px] mx-auto py-[60px] md:py-[120px] px-5 md:px-10 border-t border-border">
        <div className="flex-1">
          <div className="text-[0.8rem] font-bold text-accent-light tracking-[0.15em] uppercase mb-3">02 / Success Stories</div>
          <h2 className="text-[1.8rem] md:text-[2.5rem] font-extrabold mb-5 leading-[1.2]">サクセスストーリー / 合格体験記</h2>
          <p className="text-[1.05rem] text-[#555] leading-[2] mb-[30px]">難関大学院を突破した先輩たちのリアルな軌跡。<br />独自の勉強スケジュール、研究室訪問のコツ、モチベーション維持の方法まで、生の声をお届けします。</p>
          <Link className="inline-block px-[36px] py-[14px] bg-text text-white rounded-full font-bold text-[0.95rem] transition-all duration-300 hover:bg-accent hover:opacity-100 hover:-translate-y-[2px]" href="/story">体験記を読む →</Link>
        </div>
        <div className="flex-1 relative w-full">
          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-gray">
            <img className="w-full h-full object-cover" alt="合格体験記" src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop" />
          </div>
        </div>
      </div>

      {/* 03: メンター相談 — 準備中のため非表示 */}
      {/* <div className="flex flex-col md:flex-row items-center gap-[40px] md:gap-[80px] max-w-[1100px] mx-auto py-[60px] md:py-[120px] px-5 md:px-10 border-t border-border">
        <div className="flex-1">
          <div className="text-[0.8rem] font-bold text-accent-light tracking-[0.15em] uppercase mb-3">03 / Mentoring</div>
          <h2 className="text-[1.8rem] md:text-[2.5rem] font-extrabold mb-5 leading-[1.2]">メンターマッチ / メンター相談</h2>
          <p className="text-[1.05rem] text-[#555] leading-[2] mb-[30px]">現役院生にオンラインで直接相談。研究室選びのリアルな話、<br />面接対策、研究計画書のレビューまで、マンツーマンでサポート。</p>
          <Link className="inline-block px-[36px] py-[14px] bg-text text-white rounded-full font-bold text-[0.95rem] transition-all duration-300 hover:bg-accent hover:opacity-100 hover:-translate-y-[2px]" href="/exam/mentor">面談・添削を申し込む →</Link>
        </div>
        <div className="flex-1 relative w-full">
          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-gray">
            <img className="w-full h-full object-cover" alt="メンター" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" />
          </div>
        </div>
      </div> */}

      {/* 04: 質問掲示板 (画像 左) */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-[40px] md:gap-[80px] max-w-[1100px] mx-auto py-[60px] md:py-[120px] px-5 md:px-10 border-t border-border">
        <div className="flex-1">
          <div className="text-[0.8rem] font-bold text-accent-light tracking-[0.15em] uppercase mb-3">04 / Community</div>
          <h2 className="text-[1.8rem] md:text-[2.5rem] font-extrabold mb-5 leading-[1.2]">Q&amp;Aボード / 質問掲示板</h2>
          <p className="text-[1.05rem] text-[#555] leading-[2] mb-[30px]">「この問題の解き方がわからない」「研究室訪問のマナーは？」<br />院試に関するあらゆる疑問を、先輩や同期と解決できるコミュニティ。</p>
          <Link className="inline-block px-[36px] py-[14px] bg-text text-white rounded-full font-bold text-[0.95rem] transition-all duration-300 hover:bg-accent hover:opacity-100 hover:-translate-y-[2px]" href="#">掲示板を見る →</Link>
        </div>
        <div className="flex-1 relative w-full">
          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-gray">
            <img className="w-full h-full object-cover" alt="掲示板" src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop" />
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <section className="bg-text text-white py-[100px] px-10 text-center">
        <h2 className="text-[2.5rem] font-extrabold mb-5">未来を描こう</h2>
        <p className="text-[1.1rem] opacity-80 mb-10">サービスに関するご質問や掲載のご依頼はこちらから。</p>
        <Link className="inline-block bg-white text-text px-[50px] py-[15px] rounded-full font-bold text-[1.1rem] transition-transform duration-200 hover:scale-105 hover:opacity-100" href="/contact">お問い合わせ</Link>
      </section>
    </>
  );
}