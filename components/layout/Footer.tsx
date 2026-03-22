import Link from "next/link";
import { FOOTER_COMPANY_LINKS, FOOTER_SERVICE_LINKS, FOOTER_LEGAL_LINKS } from "@/lib/navigation";

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
                        {FOOTER_COMPANY_LINKS.map((link) => (
                            <li key={link.href} className="mb-2 text-[0.9rem]">
                                <Link href={link.href} className="transition-opacity duration-300 hover:opacity-70 hover:underline">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                    <ul className="list-none">
                        <li className="font-bold mb-3 text-[0.85rem] text-[#999] uppercase tracking-wider">サービス / Services</li>
                        {FOOTER_SERVICE_LINKS.map((link) => (
                            <li key={link.href} className="mb-2 text-[0.9rem]">
                                <Link href={link.href} className="transition-opacity duration-300 hover:opacity-70 hover:underline">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                    <ul className="list-none">
                        <li className="font-bold mb-3 text-[0.85rem] text-[#999] uppercase tracking-wider">規約・ポリシー / Legal</li>
                        {FOOTER_LEGAL_LINKS.map((link) => (
                            <li key={link.href} className="mb-2 text-[0.9rem]">
                                <Link href={link.href} className="transition-opacity duration-300 hover:opacity-70 hover:underline">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </footer>
            {/* コピーライトの年を 2026 に更新 */}
            <div className="text-center p-[20px_40px] text-[0.8rem] text-[#999] border-t border-border bg-white">&copy; 2026 AcadeMina. All rights reserved.</div>
        </>
    );
}