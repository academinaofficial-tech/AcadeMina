import Script from "next/script";

export const metadata = {
  title: "カート | AcadeMina",
};

export default function Page() {
  return (
    <>
      <div className="bg-white py-[30px] md:py-10 px-5 md:px-10 border-b border-border">
        <h1 className="text-[2rem] font-extrabold">ショッピングカート</h1>
      </div>
      <div className="flex flex-col md:flex-row max-w-[1100px] mx-auto my-[30px] px-5 gap-[30px] items-start">
        <div className="flex-1 min-w-0 w-full" id="cart-main"></div>
        <div className="w-full md:w-[340px] shrink-0 md:sticky md:top-[100px]" id="cart-sidebar"></div>
      </div>
      <div className="max-w-[1100px] mx-auto my-[50px] px-5" id="recommend-section"></div>

      <Script src="/store-data.js" strategy="afterInteractive" />
      <Script src="/scripts/cart__inline1.js" strategy="afterInteractive" />
    </>
  );
}
