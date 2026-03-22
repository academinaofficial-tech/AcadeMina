import type { Metadata } from "next";

// このページだけ検索結果に出さない
export const metadata: Metadata = {
  title: "利用規約・プライバシーポリシー・特定商取引法に基づく表記 | AcadeMina",
  description:
    "AcadeMinaの利用規約、プライバシーポリシー、および特定商取引法に基づく表記を掲載しています。",
  robots: {
    index: false,
    follow: false,
  },
};

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left">
        <div className="flex items-center gap-3">
          <span className="h-5 w-1.5 rounded-full bg-[#0044cc]" />
          <h2 className="text-[1rem] font-bold text-[#2d2f31] sm:text-[1.08rem]">
            {title}
          </h2>
        </div>
        <span className="shrink-0 text-[0.9rem] text-gray-500 transition group-open:rotate-180">
          ▼
        </span>
      </summary>
      <div className="border-t border-gray-100 px-5 py-5 text-[0.92rem] leading-[1.95] text-[#4a4a4a]">
        {children}
      </div>
    </details>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-gray-100 px-4 py-4 last:border-b-0 sm:grid-cols-[220px_1fr] sm:gap-4">
      <dt className="text-[0.88rem] font-semibold text-gray-500">{label}</dt>
      <dd className="text-[0.92rem] text-gray-700">{value}</dd>
    </div>
  );
}

export default function Page() {
  return (
    <div className="mx-auto my-[72px] max-w-[880px] px-5 sm:my-[96px] sm:px-6">
      <div className="mb-10">
        <p className="mb-3 text-[0.78rem] tracking-[0.12em] text-gray-400 uppercase">
          AcadeMina
        </p>
        <h1 className="text-[1.7rem] font-bold leading-[1.4] text-[#2d2f31] sm:text-[2rem]">
          利用規約・プライバシーポリシー・
          <br className="sm:hidden" />
          特定商取引法に基づく表記
        </h1>
        <p className="mt-4 max-w-[760px] text-[0.92rem] leading-[1.9] text-gray-600">
          AcadeMina（以下「当サービス」といいます。）は、大学院入試対策教材、体験記、研究室情報その他関連情報を提供するサービスです。
          当ページでは、当サービスの利用条件、個人情報の取扱い、ならびに特定商取引法に基づく表記をまとめて掲載しています。
        </p>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[0.86rem] leading-[1.8] text-amber-900">
          重要事項：
          当サービス上の教材・解説・体験記・研究室情報・コラム等について、正確性、完全性、最新性、有用性、特定目的への適合性は保証していません。
          また、デジタルコンテンツの性質上、購入完了後の返金・返品・キャンセルには応じられません。
        </div>
      </div>

      <div className="space-y-5">
        <AccordionSection title="利用規約" defaultOpen>
          <div className="space-y-6">
            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">第1条（適用）</h3>
              <p>
                本規約は、当サービスが提供するすべてのコンテンツおよびサービスの利用条件を定めるものです。
                ユーザーは、当サービスを利用することにより、本規約に同意したものとみなされます。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">第2条（サービス内容）</h3>
              <p>
                当サービスは、大学院入試対策教材、解答解説、体験記、研究室情報、コミュニティ機能、相談機能、その他これらに付随する情報提供を行います。
              </p>
              <p className="mt-2">
                当サービスは、事前の予告なく、サービス内容の追加、変更、停止または終了を行うことがあります。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                第3条（情報の正確性等に関する免責）
              </h3>
              <p>
                当サービスで提供される教材、解答解説、体験記、研究室情報、コラム、掲示板投稿、相談回答その他一切の情報は、作成者個人の見解、経験、調査結果または収集時点の情報に基づくものであり、当サービスはそれらの正確性、完全性、最新性、有用性、合法性、特定目的への適合性を保証しません。
              </p>
              <p className="mt-2">
                当サービス上の情報には誤記、更新漏れ、主観的評価、不完全な情報が含まれる場合があります。ユーザーは、自らの判断と責任においてこれらの情報を利用するものとします。
              </p>
              <p className="mt-2">
                当サービス上の情報または教材の利用により生じた一切の不利益、損害、不合格、進学機会の逸失、金銭的損失その他の結果について、当サービスおよび作成者は一切の責任を負いません。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                第4条（購入コンテンツに関する注意）
              </h3>
              <p>
                当サービスで販売されるPDFその他のデジタルコンテンツは、学習支援や情報提供を目的とするものであり、合格、成績向上、研究室配属、進路決定その他の成果を保証するものではありません。
              </p>
              <p className="mt-2">
                解答例や解説には誤りや解釈の相違が含まれる可能性がありますが、当サービスはその修正義務や保証責任を負いません。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                第5条（知的財産権・禁止事項）
              </h3>
              <p>
                当サービス内の教材、文章、画像、デザイン、ロゴ、データベースその他一切のコンテンツに関する著作権その他の知的財産権は、当サービス運営者または正当な権利者に帰属します。
              </p>
              <div className="mt-3 space-y-1">
                <p>ユーザーは、以下の行為をしてはなりません。</p>
                <p>・購入コンテンツの無断転載、複製、配布、再販売、譲渡</p>
                <p>・SNS、動画サイト、掲示板、クラウドストレージ等へのアップロード</p>
                <p>・フリマアプリ、オークションサイト、掲示板等での転売</p>
                <p>・スクリーンショット等を用いた第三者への共有</p>
                <p>・当サービスまたは第三者の権利、利益、名誉を侵害する行為</p>
                <p>・不正アクセス、システムへの攻撃、運営妨害行為</p>
                <p>・法令または公序良俗に反する行為</p>
              </div>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                第6条（料金、返品、返金、キャンセル）
              </h3>
              <p>
                当サービスの有料商品または有料機能の料金は、各商品ページまたは申込画面に表示される金額とします。
              </p>
              <p className="mt-2">
                デジタルコンテンツの性質上、購入手続完了後の返品、返金、交換およびキャンセルには応じられません。
              </p>
              <p className="mt-2">
                ユーザーは、購入前に商品内容、価格、対応形式、注意事項を十分に確認したうえで購入するものとします。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                第7条（サービスの中断・停止）
              </h3>
              <p>
                当サービスは、システム保守、障害対応、通信障害、天災、火災、停電、外部サービスの停止、その他運営上または技術上の必要がある場合、事前通知なくサービスの全部または一部を中断または停止することがあります。
              </p>
              <p className="mt-2">
                これによりユーザーに生じた損害について、当サービスは一切の責任を負いません。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                第8条（アカウント・コミュニティ利用）
              </h3>
              <p>
                ユーザーは、登録情報を正確に管理し、自己の責任でアカウントを利用するものとします。
                コミュニティ、相談機能、掲示板等において、虚偽情報の投稿、誹謗中傷、営業行為、勧誘行為、その他運営が不適切と判断する行為を行ってはなりません。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                第9条（未成年者の利用）
              </h3>
              <p>
                未成年者が当サービスを利用し、または有料商品を購入する場合は、法定代理人の同意を得たうえで行うものとします。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                第10条（規約の変更）
              </h3>
              <p>
                当サービスは、必要に応じて本規約を変更できるものとします。変更後の規約は、当ページへの掲載その他当サービスが適切と判断する方法により周知した時点から効力を生じます。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                第11条（準拠法・管轄）
              </h3>
              <p>
                本規約の解釈には日本法を準拠法とし、当サービスに関連して生じた紛争については、運営者所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </section>
          </div>
        </AccordionSection>

        <AccordionSection title="特定商取引法に基づく表記">
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <dl>
              <InfoRow
                label="販売事業者名"
                value="AcadeMina"
              />
              <InfoRow
                label="運営責任者"
                value="張本　俊彦"
              />
              <InfoRow
                label="所在地"
                value="請求があった場合、遅滞なく開示いたします。"
              />
              <InfoRow
                label="電話番号"
                value="請求があった場合、遅滞なく開示いたします。"
              />
              <InfoRow
                label="お問い合わせ先"
                value="academina.official@gmail.com"
              />
              <InfoRow
                label="販売価格"
                value="各商品詳細ページに表示された価格（税込）によります。"
              />
              <InfoRow
                label="商品代金以外の必要料金"
                value="インターネット接続料金、通信料金等はお客様のご負担となります。"
              />
              <InfoRow
                label="支払方法"
                value="クレジットカード決済（Stripe）"
              />
              <InfoRow
                label="支払時期"
                value="購入手続完了時に決済されます。"
              />
              <InfoRow
                label="商品の引渡時期"
                value="代金決済手続完了後、直ちにダウンロードまたは閲覧可能となります。"
              />
              <InfoRow
                label="返品・交換・キャンセル"
                value="デジタルコンテンツの性質上、購入手続完了後の返品、交換、返金およびキャンセルには応じられません。"
              />
              <InfoRow
                label="動作環境"
                value="PDFその他のデジタルコンテンツを閲覧できる端末、ソフトウェアおよびインターネット接続環境が必要です。"
              />
            </dl>
          </div>

          <p className="mt-4 text-[0.84rem] leading-[1.8] text-gray-500">
            ※ 所在地および電話番号については、特定商取引法に基づき、請求があった場合に遅滞なく開示いたします。
          </p>
        </AccordionSection>

        <AccordionSection title="プライバシーポリシー">
          <div className="space-y-6">
            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                1. 取得する情報
              </h3>
              <div className="space-y-1">
                <p>当サービスは、以下の情報を取得することがあります。</p>
                <p>・氏名、表示名、メールアドレス</p>
                <p>・所属大学、学部、研究科、志望分野等の登録情報</p>
                <p>・購入履歴、申込履歴、お問い合わせ内容</p>
                <p>・アクセスログ、Cookie、利用端末情報、閲覧履歴等の利用情報</p>
              </div>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                2. 利用目的
              </h3>
              <div className="space-y-1">
                <p>取得した情報は、以下の目的で利用します。</p>
                <p>・教材、サービス、コミュニティ機能の提供のため</p>
                <p>・本人確認、ログイン管理、不正利用防止のため</p>
                <p>・購入確認、決済確認、ダウンロード提供のため</p>
                <p>・お問い合わせへの対応のため</p>
                <p>・サービス改善、機能開発、品質向上のため</p>
                <p>・重要なお知らせ、規約変更、障害情報等の通知のため</p>
              </div>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                3. 決済情報の取扱い
              </h3>
              <p>
                当サービスは、決済処理を外部決済事業者であるStripe等に委託する場合があります。
                クレジットカード情報その他の決済に必要な機微な情報は、原則として当サービスのサーバーでは保存せず、各決済事業者のシステムにおいて管理されます。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                4. 第三者提供
              </h3>
              <p>
                当サービスは、法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。
                ただし、決済代行、サーバー運用、メール送信、アクセス解析等の業務を外部事業者に委託する場合があります。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                5. Cookie等の利用
              </h3>
              <p>
                当サービスは、ログイン状態の維持、利便性向上、アクセス解析、不正利用防止等のためにCookieその他これに類する技術を利用することがあります。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                6. 安全管理
              </h3>
              <p>
                当サービスは、取得した情報の漏えい、滅失または毀損の防止その他安全管理のため、合理的な範囲で必要かつ適切な措置を講じます。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                7. 開示、訂正、削除等の請求
              </h3>
              <p>
                ユーザーは、自己の個人情報について、開示、訂正、追加、削除、利用停止等を求めることができます。
                請求を希望する場合は、下記のお問い合わせ先までご連絡ください。法令および本人確認の結果に基づき、合理的な範囲で対応します。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                8. お問い合わせ窓口
              </h3>
              <p>
                個人情報の取扱いに関するお問い合わせは、
                <span className="font-medium">
                  {" "}
                  academina.official@gmail.com
                </span>
                 までご連絡ください。
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-bold text-[#2d2f31]">
                9. 改定
              </h3>
              <p>
                当サービスは、必要に応じて本ポリシーを改定することがあります。改定後の内容は、当ページに掲載した時点から効力を生じます。
              </p>
            </section>
          </div>
        </AccordionSection>
      </div>

      <div className="mt-10 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-[0.82rem] leading-[1.8] text-gray-500">
        <p>制定日：2026年3月13日</p>
        <p>最終改定日：2026年3月13日</p>
      </div>
    </div>
  );
}