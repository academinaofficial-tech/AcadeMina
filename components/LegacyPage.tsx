'use client';

import Script from 'next/script';

type LegacyScript = { src: string; type?: string };

export default function LegacyPage({
  html,
  css,
  scripts,
}: {
  html: string;
  css?: string;
  scripts?: LegacyScript[];
}) {
  return (
    <>
      {css ? <style jsx global>{css}</style> : null}
      {(scripts || []).map((s) => (
        <Script key={s.src} src={s.src} strategy="afterInteractive" type={s.type} />
      ))}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
