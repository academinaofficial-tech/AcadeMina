"use client";

import Script from "next/script";

export default function Page() {
  return (
    <main style={{ marginTop: 70 }}>
      {/* 
        Removed explicit inline header & footer 
        which duplicated global layout implementation.
      */}
      <div id="detail-content"></div>

      <Script src="/labs-data.js" strategy="afterInteractive" />
      <Script src="/scripts/detail__inline1.js" strategy="afterInteractive" />
    </main>
  );
}
