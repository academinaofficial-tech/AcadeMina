import type { Metadata } from "next";
import Link from "next/link";
import { getArticles, formatDate } from "@/lib/cms";

export const metadata: Metadata = {
  title: "AcadeMina | 研究者を、増やす。大学院入試・院試サポート",
};

export default async function Page() {
  const data = await getArticles({ limit: 30 });

  const columnArticles = data.contents
    .filter((a: any) => a.category?.article_type === "column")
    .slice(0, 3);

  const newsArticles = data.contents
    .filter((a: any) => a.category?.article_type === "news")
    .slice(0, 3);

  return (
    <main>
      <section className="relative h-[92vh] flex items-center px-5 md:px-10 text-white bg-[#333] bg-[linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)),url('/images/hero.png')] bg-cover bg-center mt-20 md:mt-[134px]">
        <div className="max-w-[1200px] w-full mx-auto">
          <h1 className="text-[2.8rem] md:text-[4.5rem] leading-[1.1] font-extrabold mb-[30px] tracking-[-0.02em]">We Support<br/>The Next Generation<br/>of Researchers</h1>
          <p className="text-[1.15rem] max-w-[600px] mb-[50px] font-medium leading-[1.8]">学問の最前線を目指すあなたへ。<br />研究室選びから大学院入試突破、その先のキャリアまで。アカデミアへの挑戦をトータルプロデュースします。</p>
          <Link className="inline-block bg-white text-text px-10 py-[15px] rounded-full font-bold text-[1rem] transition-transform duration-200 hover:-translate-y-0.5" href="/about">AcadeMinaとは</Link>
        </div>
      </section>

      <section className="w-full" id="services">
        <div className="flex flex-col md:flex-row flex-wrap min-h-[70vh]">
          {/* 💡 元の /lab に戻しました */}
          <article className="flex-1 min-w-[300px] relative p-20 md:p-[80px_40px] flex flex-col justify-between text-white bg-[#444] bg-cover bg-center transition-all duration-300 hover:brightness-110 cursor-pointer bg-[linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)),url('/images/lab.png')] border-b border-white/20 md:border-b-0 md:border-r border-white/20">
            <Link className="absolute top-0 left-0 w-full h-full z-10" href="/lab"></Link>
            <div className="relative z-20">
              <span className="block text-[0.85rem] font-bold text-accent-light mb-5 uppercase tracking-widest">01 / Research Database</span>
              <h2 className="text-[2rem] md:text-[2.8rem] font-extrabold leading-[1.2] mb-5">研究室検索</h2>
              <p className="text-[1.05rem] mb-10 opacity-90 max-w-[500px]">ブラックボックス化しがちな「研究室の実態」を可視化。<br />自分にぴったりの環境を見つけましょう。</p>
              <ul className="list-none border-t border-white/30 pt-5">
                <li className="mb-2.5 flex items-center font-semibold before:content-['→'] before:mr-2.5 before:text-accent-light">研究内容・プロジェクトの詳細</li>
                <li className="mb-2.5 flex items-center font-semibold before:content-['→'] before:mr-2.5 before:text-accent-light">教授・研究室へのコンタクト先</li>
                <li className="mb-2.5 flex items-center font-semibold before:content-['→'] before:mr-2.5 before:text-accent-light">研究室ごとの特徴</li>
              </ul>
            </div>
            <Link className="relative z-20 mt-auto font-bold text-[1.1rem] underline underline-offset-4" href="/lab">研究室を探す →</Link>
          </article>
          
          {/* 💡 こちらも元の /exam です */}
          <article className="flex-1 min-w-[300px] relative p-20 md:p-[80px_40px] flex flex-col justify-between text-white bg-[#444] bg-cover bg-center transition-all duration-300 hover:brightness-110 cursor-pointer bg-[linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)),url('/images/exam.png')] border-b border-white/20 md:border-b-0">
            <Link className="absolute top-0 left-0 w-full h-full z-10" href="/exam"></Link>
            <div className="relative z-20">
              <span className="block text-[0.85rem] font-bold text-accent-light mb-5 uppercase tracking-widest">02 / Exam Strategy</span>
              <h2 className="text-[2rem] md:text-[2.8rem] font-extrabold leading-[1.2] mb-5">院試マスター</h2>
              <p className="text-[1.05rem] mb-10 opacity-90 max-w-[400px]">過去問解説から合格体験記まで、<br />院試突破に必要なナレッジをすべて凝縮。</p>
              <ul className="list-none border-t border-white/30 pt-5">
                <li className="mb-2.5 flex items-center font-semibold before:content-['→'] before:mr-2.5 before:text-accent-light">院試過去問の解答・解説</li>
                <li className="mb-2.5 flex items-center font-semibold before:content-['→'] before:mr-2.5 before:text-accent-light">オリジナル対策・予想問題</li>
                <li className="mb-2.5 flex items-center font-semibold before:content-['→'] before:mr-2.5 before:text-accent-light">合格者の体験記・研究計画書</li>
              </ul>
            </div>
            <Link className="relative z-20 mt-auto font-bold text-[1.1rem] underline underline-offset-4" href="/exam">対策を始める →</Link>
          </article>
        </div>
      </section>

      <section className="px-5 md:px-10 py-[100px] max-w-[1200px] w-full mx-auto" id="column">
        <div className="flex justify-between items-end mb-10 border-b-2 border-text pb-5">
          <h2 className="text-[2.5rem] font-extrabold">Column</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10 mb-[60px]">
          {columnArticles.map((a: any) => {
            const imgUrl = a.eyecatch ? a.eyecatch.url : '/images/col-placeholder.jpg';
            return (
              <Link href={`/column-detail?id=${a.id}`} key={a.id} className="flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1.5 group">
                <div className="h-[200px] bg-gray bg-cover bg-center rounded-t-md border border-b-0 border-border" style={{ backgroundImage: `url('${imgUrl}')` }}></div>
                <div className="p-5 border border-border rounded-b-md flex-1 bg-white">
                  <div className="text-[0.8rem] text-gray-500 mb-2 font-medium">{formatDate(a.publishedAt)} / {a.category?.category || 'Column'}</div>
                  <h3 className="text-[1rem] font-bold leading-[1.6] group-hover:text-blue-600 transition-colors">{a.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-center">
          <Link className="inline-block border border-text px-10 py-3 rounded-full font-semibold transition-all duration-200 hover:bg-text hover:text-white" href="/column">コラム一覧へ</Link>
        </div>
      </section>

      <div className="w-full bg-[#fafafa]">
        <section className="px-5 md:px-10 py-[100px] max-w-[1200px] w-full mx-auto" id="news">
          <div className="flex justify-between items-end mb-10 border-b-2 border-text pb-5">
            <h2 className="text-[2.5rem] font-extrabold">News</h2>
            <Link className="font-semibold text-[0.9rem] hover:opacity-70 transition-opacity" href="/news">一覧を見る →</Link>
          </div>
          <ul className="list-none border-t border-border">
            {newsArticles.map((n: any) => (
              <li key={n.id} className="flex flex-col md:flex-row md:items-center py-[25px] border-b border-border transition-colors duration-200 hover:bg-white group px-4 -mx-4 rounded-lg">
                <Link href={`/news-detail?id=${n.id}`} className="flex flex-col md:flex-row md:items-center w-full">
                  <span className="font-bold text-[0.9rem] text-[#666] md:w-[120px] shrink-0 mb-2 md:mb-0">{formatDate(n.publishedAt)}</span>
                  <span className="text-[1rem] font-semibold flex-1 group-hover:text-blue-600 transition-colors">{n.title}</span>
                  <span className="ml-0 md:ml-5 text-[1.2rem] hidden md:block opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-text text-white py-[100px] px-5 md:px-10 text-center">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-[2.5rem] font-extrabold mb-5">お問い合わせ</h2>
          <p className="text-[1.1rem] mb-10 opacity-80 leading-relaxed">サービスに関するご質問、研究室掲載のご依頼、提携のご相談など、<br />お気軽にお問い合わせください。</p>
          <Link className="inline-block bg-white text-text px-[50px] py-[15px] rounded-full font-bold text-[1.1rem] transition-transform duration-200 hover:scale-105" href="/contact">Contact Us</Link>
        </div>
      </section>
    </main>
  );
}