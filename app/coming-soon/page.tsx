import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: '近日公開 | AcadeMina',
  description: '現在準備中です。公開までもうしばらくお待ちください。',
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center pt-[100px] pb-24 px-5">
      <div className="max-w-[700px] w-full text-center space-y-8">
        {/* Icon & Badge */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-tr from-accent to-blue-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-accent/30 rotate-3 hover:rotate-6 transition-transform">
            <span className="text-white text-5xl">🛠️</span>
          </div>
          <span className="inline-block bg-accent/10 text-accent font-black text-xs px-4 py-2 rounded-full tracking-widest uppercase">
            Work in Progress
          </span>
        </div>

        {/* Text Content */}
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>

          <h1 className="text-3xl md:text-5xl font-black text-text mb-6 tracking-tight relative z-10">
            近日公開予定
          </h1>
          <p className="text-gray-500 font-bold leading-relaxed max-w-[500px] mx-auto relative z-10 text-base md:text-lg">
            現在、この機能は<span className="text-accent underline decoration-accent/30 decoration-4 underline-offset-4">鋭意開発中</span>です。<br className="hidden md:block" />
            皆様に最高の体験をお届けできるよう準備を進めておりますので、公開までもうしばらくお待ちください。
          </p>

          <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center relative z-10">
            <Button href="/" variant="solid" className="px-8 text-sm">
              トップページに戻る
            </Button>
            <Button href="/mypage" variant="outline" className="px-8 text-sm bg-white">
              マイページを見る
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
