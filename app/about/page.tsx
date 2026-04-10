import type { Metadata } from "next";
import Typography from "@/components/ui/Typography";
import { Section, Container } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "AcadeMinaとは｜大学院受験生の挑戦を支える運営理念とサービス紹介",
  description:
    "AcadeMinaのビジョン、運営の想い、サービス立ち上げの背景を紹介します。なぜ大学院受験に特化したのか、どんな価値を届けたいのかを知りたい方はこちらをご覧ください。",
};

export default function Page() {
  return (
    <main>
      <Section spacing="none" className="h-[85vh] flex items-center justify-center relative bg-[#fafafa] mt-20 md:mt-[134px]">
        {/* -mr を削除し、flex の中で自然に中央配置されるように変更。
          縦書き時の文字間隔と行間のバランスを微調整しました。
        */}
        <Typography variant="h1" component="h1" className="[writing-mode:vertical-rl] font-serif tracking-[0.3em] font-medium text-center antialiased">
          研究者を、<br />
          <span className="mt-[0.5em]">増やす。</span>
        </Typography>
        <div className="absolute bottom-10 right-10 text-[0.8rem] tracking-[0.1em] text-[#666] font-sans uppercase">
          AcadeMina / MISSION
        </div>
      </Section>

      <Section>
        <Container variant="narrow" className="text-center">
          <Typography variant="h3" component="span" className="mb-[60px] inline-block border-b border-black pb-2.5">Our Core Purpose</Typography>
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
        </Container>
      </Section>

      <Section className="bg-[#111] text-white py-[100px]">
        <Container className="max-w-[1000px] flex flex-col md:flex-row items-center gap-[30px] md:gap-[60px]">
          <div className="flex-1">
            <Typography variant="h2" className="mb-[30px] font-sans">Who We Are</Typography>
            <p className="text-[1rem] leading-[2] opacity-90">
              このサービスを運営しているのは、実際に院試を経験し、<br />
              アカデミアの道を選んだ現役の東京大学や東京科学大学などの大学院生たちです。<br /><br />
              私たち自身もかつて、情報の少なさや研究室選びの難しさに苦悩しました。<br />
              同じ痛みを経験した当事者だからこそ、<br />
              本当に必要な情報、本当に欲しかった支援を届けることができます。<br />
              私たちは、あなたの挑戦の、一番近くにいる伴走者です。
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="text-center mb-[80px]">
            <Typography variant="h2" className="mb-2.5">Our Solutions</Typography>
            <Typography variant="body">2つのアプローチで、院進のペインを解消します。</Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px]">
            <div className="bg-white p-[50px] border border-border transition-transform duration-300 hover:-translate-y-1.5">
              <Typography variant="h3" component="span" className="mb-5 block text-accent">Lab Insight</Typography>
              <span className="font-bold font-serif text-[1.1rem] mb-5 block">「やりたい研究はあるが、<br />自分に合う研究室が見つからない」</span>
              <Typography variant="body" className="!leading-[1.8] !text-[0.95rem]">
                研究室の実態は、外からはブラックボックスになりがちです。Lab Insightは、テーマや条件から最適な研究室を横断的に検索できるデータベース。教授の人柄や研究環境など、リアルな情報でミスマッチを防ぎます。
              </Typography>
            </div>
            <div className="bg-white p-[50px] border border-border transition-transform duration-300 hover:-translate-y-1.5">
              <Typography variant="h3" component="span" className="mb-5 block text-accent">Exam Master</Typography>
              <span className="font-bold font-serif text-[1.1rem] mb-5 block">「院試の情報が閉鎖的で、<br />十分な対策ができない」</span>
              <Typography variant="body" className="!leading-[1.8] !text-[0.95rem]">
                大学受験と違い、院試は圧倒的に情報不足です。Exam Masterは、過去問の解答解説から合格者の体験記、研究計画書の書き方まで、合格に必要な「武器」を網羅的に提供します。
              </Typography>
            </div>
          </div>
        </Container>
      </Section>
      {/* お問い合わせへの誘導セクション */}
      <Section className="bg-[#fafafa] text-center border-t border-border">
        <Container variant="narrow">
          <Typography variant="h2" className="mb-5 font-sans">お問い合わせ</Typography>
          <Typography variant="body" className="mb-10 leading-[1.8]">
            研究室掲載のご依頼、サービスへのご質問、<br className="hidden md:block" />
            提携のご相談など、お気軽にお問い合わせください。
          </Typography>
          <a 
            href="/contact" 
            className="inline-block py-4 px-10 bg-[#2d2f31] text-white rounded-full font-bold text-[1.1rem] transition-all duration-300 hover:bg-[#0044cc] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,68,204,0.2)]"
          >
            Contact Us
          </a>
        </Container>
      </Section>
    </main>
  );
}
