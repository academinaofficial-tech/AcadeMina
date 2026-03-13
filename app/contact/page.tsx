import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact | AcadeMina",
};

export default function Page() {
  return (
    <main className="mt-20 md:mt-[134px] bg-gray-50/30 min-h-screen">
      <div className="py-24 px-5 text-center bg-white border-b border-gray-100">
        <div className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Contact Us</div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">お問い合わせ</h1>
        <p className="text-gray-500 max-w-[600px] mx-auto leading-relaxed">
          サービスに関するご質問、研究室掲載のご依頼、<br />
          大学・企業様からの提携に関するお問い合わせはこちらから承ります。
        </p>
      </div>

      <ContactClient />
    </main>
  );
}
