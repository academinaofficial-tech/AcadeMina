"use client";

import Link from "next/link";
import Script from "next/script";


export default function Page() {
  return (
    <main style={{ marginTop: 70 }}>
      <div className="py-[15px] px-10 text-[0.8rem] text-[#666] bg-white border-b border-border md:px-5" id="breadcrumb">
        <Link className="text-accent font-semibold" href="/">TOP</Link> &gt; <Link className="text-accent font-semibold" href="/exam">院試対策</Link> &gt; ...
      </div>
      <div className="flex flex-col md:flex-row max-w-[1100px] mx-auto my-[30px] px-5 gap-10 items-start">
        <div className="flex-1 min-w-0" id="product-main"></div>
        <div className="w-full md:w-[340px] shrink-0 md:sticky md:top-[100px]" id="product-panel"></div>
      </div>

      <Script src="/store-data.js" strategy="afterInteractive" />
      <Script src="/scripts/product__inline1.js" strategy="afterInteractive" />
    </main>
  );
}
