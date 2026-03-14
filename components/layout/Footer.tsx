import Link from "next/link";

export default function Footer() {
    return (
        <>
            <footer className="px-5 py-10 md:p-[60px_40px] bg-white text-text border-t border-border flex flex-col md:flex-row justify-between items-start gap-[30px] md:gap-0">
                <div className="flex flex-col gap-6">
                    <img src="/images/logo.png" alt="AcadeMina" className="h-[120px] md:h-20 w-auto object-contain self-start" />
                    <div className="flex items-center gap-4 px-2">
                        <a href="https://note.com/grand_avocet7665" target="_blank" rel="noopener noreferrer" className="transition-transform duration-200 hover:scale-110" title="note">
                            <img src="/images/icon-note.png" alt="note" className="w-6 h-6 rounded-sm" />
                        </a>
                        <a href="https://x.com/AcadeMina_ofc" target="_blank" rel="noopener noreferrer" className="transition-transform duration-200 hover:scale-110" title="X">
                            <img src="/images/icon-x.png" alt="X" className="w-6 h-6" />
                        </a>
                        <a href="https://www.instagram.com/academina.official/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-200 hover:scale-110" title="Instagram">
                            <img src="/images/icon-instagram.png" alt="Instagram" className="w-6 h-6" />
                        </a>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-[30px] md:gap-[50px]">
                    <ul className="list-none">
                        <li className="font-bold mb-3 text-[0.85rem] text-[#999] uppercase tracking-wider">運営 / Company</li>
                        <li className="mb-2 text-[0.9rem]"><Link href="/about" className="transition-opacity duration-300 hover:opacity-70 hover:underline">AcadeMinaとは</Link></li>
                        <li className="mb-2 text-[0.9rem]"><Link href="/contact" className="transition-opacity duration-300 hover:opacity-70 hover:underline">お問い合わせ</Link></li>
                    </ul>
                    <ul className="list-none">
                        <li className="font-bold mb-3 text-[0.85rem] text-[#999] uppercase tracking-wider">サービス / Services</li>
                        <li className="mb-2 text-[0.9rem]"><Link href="/lab" className="transition-opacity duration-300 hover:opacity-70 hover:underline">研究室検索</Link></li>
                        <li className="mb-2 text-[0.9rem]"><Link href="/exam" className="transition-opacity duration-300 hover:opacity-70 hover:underline">院試サポート</Link></li>
                        <li className="mb-2 text-[0.9rem]"><Link href="/exam-store" className="transition-opacity duration-300 hover:opacity-70 hover:underline">教材ストア</Link></li>
                        <li className="mb-2 text-[0.9rem]"><Link href="/column" className="transition-opacity duration-300 hover:opacity-70 hover:underline">コラム</Link></li>
                    </ul>
                    <ul className="list-none">
                        <li className="font-bold mb-3 text-[0.85rem] text-[#999] uppercase tracking-wider">規約・ポリシー / Legal</li>
                        <li className="mb-2 text-[0.9rem]"><Link href="/legal" className="transition-opacity duration-300 hover:opacity-70 hover:underline">利用規約・プライバシーポリシー</Link></li>
                    </ul>
                </div>
            </footer>
            <div className="text-center p-[20px_40px] text-[0.8rem] text-[#999] border-t border-border bg-white">&copy; 2025 AcadeMina. All rights reserved.</div>
        </>
    );
}
