import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | AcadeMina",
};

export default function Page() {
  return (
    <main>
      <section className="h-[85vh] flex items-center justify-center relative bg-[#fafafa] mt-20 md:mt-[134px]">
        <h1 className="[writing-mode:vertical-rl] font-serif text-[2rem] md:text-[3.5rem] tracking-[0.2em] font-medium leading-[2] -mr-[2em]">
          研究者を、<br />増やす。
        </h1>
        <div className="absolute bottom-10 right-10 text-[0.8rem] tracking-[0.1em] text-[#666] font-sans">AcadeMina / MISSION</div>
      </section>

      <section className="py-[120px] px-5 sm:px-10 max-w-[800px] mx-auto text-center">
        <span className="text-[1.2rem] font-bold mb-[60px] inline-block border-b border-black pb-2.5">Our Core Purpose</span>
        <div className="font-serif text-[1.1rem] leading-[2.4] mb-10 text-center">
          <p>
            先進国の中で、日本の大学院進学率は異常なほど低い水準にあります。<br />
            「知」への探求心を持ちながらも、情報の非対称性や将来への不安から、<br />
            研究の道を諦めてしまう学生があまりにも多いのが現状です。
          </p>
          <br />
          <p>
            私たちは、<strong className="font-bold bg-[linear-gradient(transparent_70%,#e6eeff_70%)]">院進における学生の「不」をなくす</strong>ために存在します。<br />
            わからない、見つからない、対策できない。<br />
            そんな障壁を取り除き、誰でも気軽に、当たり前のように大学院進学に挑戦できる。<br />
            そんな環境を作ることで、次世代の研究者を増やしていきます。
          </p>
        </div>
      </section>

      <section className="bg-[#111] text-white py-[100px] px-5 sm:px-10">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center gap-[30px] md:gap-[60px]">
          <div className="flex-1">
            <h2 className="text-[2.5rem] font-extrabold mb-[30px] font-sans">Who We Are</h2>
            <p className="text-[1rem] leading-[2] opacity-90">
              このサービスを運営しているのは、実際に院試を経験し、<br />
              アカデミアの道を選んだ現役の大学院生たちです。<br /><br />
              私たち自身もかつて、情報の少なさや研究室選びの難しさに苦悩しました。<br />
              同じ痛みを経験した当事者だからこそ、<br />
              本当に必要な情報、本当に欲しかった支援を届けることができます。<br />
              私たちは、あなたの挑戦の、一番近くにいる伴走者です。
            </p>
          </div>
        </div>
      </section>

      <section className="py-[120px] px-5 sm:px-10 max-w-[1200px] mx-auto">
        <div className="text-center mb-[80px]">
          <h2 className="text-[2rem] font-extrabold mb-2.5">Our Solutions</h2>
          <p>2つのアプローチで、院進のペインを解消します。</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px]">
          <div className="bg-white p-[50px] border border-border transition-transform duration-300 hover:-translate-y-1.5">
            <span className="text-[1.5rem] font-extrabold mb-5 block text-accent">Lab Insight</span>
            <span className="font-bold font-serif text-[1.1rem] mb-5 block">「やりたい研究はあるが、<br />自分に合う研究室が見つからない」</span>
            <p className="text-[0.95rem] text-[#555] leading-[1.8]">
              研究室の実態は、外からはブラックボックスになりがちです。Lab Insightは、テーマや条件から最適な研究室を横断的に検索できるデータベース。教授の人柄や研究環境など、リアルな情報でミスマッチを防ぎます。
            </p>
          </div>
          <div className="bg-white p-[50px] border border-border transition-transform duration-300 hover:-translate-y-1.5">
            <span className="text-[1.5rem] font-extrabold mb-5 block text-accent">Exam Master</span>
            <span className="font-bold font-serif text-[1.1rem] mb-5 block">「院試の情報が閉鎖的で、<br />十分な対策ができない」</span>
            <p className="text-[0.95rem] text-[#555] leading-[1.8]">
              大学受験と違い、院試は圧倒的に情報不足です。Exam Masterは、過去問の解答解説から合格者の体験記、研究計画書の書き方まで、合格に必要な「武器」を網羅的に提供します。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
