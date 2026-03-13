"use client";

import Script from "next/script";

export default function Page() {
  return (
    <main style={{ marginTop: 70 }}>
      {/* Explicit header/footer removed, managed by layout.tsx */}
      <div id="dept-header"></div>
      <div className="max-w-[1000px] mx-auto py-10 px-5">
        <div className="flex gap-2.5 overflow-x-auto pb-5 mb-5 scrollbar-none">
          <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white border border-[#ddd] font-bold text-[0.9rem] cursor-pointer [&.active]:bg-text [&.active]:text-white [&.active]:border-text active" onClick={() => (window as any).filterProducts('all')}>All</button>
          <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white border border-[#ddd] font-bold text-[0.9rem] cursor-pointer [&.active]:bg-text [&.active]:text-white [&.active]:border-text" onClick={() => (window as any).filterProducts('past-exam')}>過去問解説</button>
          <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white border border-[#ddd] font-bold text-[0.9rem] cursor-pointer [&.active]:bg-text [&.active]:text-white [&.active]:border-text" onClick={() => (window as any).filterProducts('practice')}>対策問題</button>
          <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white border border-[#ddd] font-bold text-[0.9rem] cursor-pointer [&.active]:bg-text [&.active]:text-white [&.active]:border-text" onClick={() => (window as any).filterProducts('forecast')}>予想問題</button>
          <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white border border-[#ddd] font-bold text-[0.9rem] cursor-pointer [&.active]:bg-text [&.active]:text-white [&.active]:border-text" onClick={() => (window as any).filterProducts('story')}>合格体験記</button>
          <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white border border-[#ddd] font-bold text-[0.9rem] cursor-pointer [&.active]:bg-text [&.active]:text-white [&.active]:border-text" onClick={() => (window as any).filterProducts('plan')}>研究計画書</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[30px] mb-[80px]" id="product-list"></div>
        <div className="border-t border-[#ddd] pt-[60px]">
          <h2 className="flex items-center gap-2.5 text-[1.5rem] font-extrabold mb-[30px]">
            Recommended
            <span className="text-[0.8rem] font-normal text-[#666] bg-[#eee] px-2 py-[3px] rounded">同じテーマ・偏差値帯の学科</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5" id="recommend-list"></div>
        </div>
      </div>

      <Script src="/exam-data.js" strategy="afterInteractive" />
      <Script src="/scripts/exam-detail__inline1.js" strategy="afterInteractive" />
    </main>
  );
}
