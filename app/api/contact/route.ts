import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { type, name, affiliation, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const typeLabels: Record<string, string> = {
      student: "学生として",
      lab: "研究室・教員として",
      univ_corp: "大学・企業として",
      other: "その他"
    };

    const typeLabel = typeLabels[type] || "その他";

    // 運営への通知メール
    await resend.emails.send({
      from: "AcadeMina Contact <send@academina.com>",
      to: "info@academina.com", // 万が一送れなかった時のために、ユーザー自身に見せる場合は実際の運営アドレスへ
      replyTo: email,
      subject: `【お問い合わせ】${subject}（${name}様より）`,
      html: `
        <h2>AcadeMina お問い合わせフォームより新しいメッセージ</h2>
        <p><strong>お問い合わせ種類:</strong> ${typeLabel}</p>
        <p><strong>氏名:</strong> ${name}</p>
        <p><strong>所属:</strong> ${affiliation || "未記入"}</p>
        <p><strong>メールアドレス:</strong> ${email}</p>
        <p><strong>電話番号:</strong> ${phone || "未記入"}</p>
        <hr />
        <h3>お問い合わせ内容:</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    // ユーザーへの自動返信メール
    await resend.emails.send({
      from: "AcadeMinaサポート <send@academina.com>",
      to: email,
      subject: "【AcadeMina】お問い合わせを受け付けました",
      html: `
        <p>${name} 様</p>
        <p>AcadeMinaへのお問い合わせありがとうございます。</p>
        <p>以下の内容で受け付けました。担当者より順次ご返信いたします。</p>
        <hr />
        <p><strong>お問い合わせ種類:</strong> ${typeLabel}</p>
        <p><strong>所属:</strong> ${affiliation || "未記入"}</p>
        <p><strong>件名:</strong> ${subject}</p>
        <p><strong>お問い合わせ内容:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr />
        <p>このメールは送信専用です。</p>
        <p>AcadeMina 運営チーム</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Resend API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
