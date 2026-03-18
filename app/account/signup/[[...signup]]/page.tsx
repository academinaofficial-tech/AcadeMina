import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignupPage() {
    return (
        <main className="min-h-screen pt-[180px] pb-[100px] bg-white">
            <div className="max-w-[800px] mx-auto px-5">
                {/* Custom Title Section */}
                <div className="text-center mb-12">
                    <h1 className="text-[2rem] font-black text-black inline-block relative pb-3 border-b-4 border-black">
                        新規会員登録
                    </h1>
                </div>

                {/* Clerk SignUp Component */}
                <div className="flex justify-center w-full">
                    <SignUp
                        routing="path"
                        path="/account/signup"
                        signInUrl="/account/login"
                        // 💡 ここを追加！サインアップ成功後にプロフィール入力画面へ飛ばす
                        forceRedirectUrl="/account/setup" 
                        appearance={{
                            elements: {
                                rootBox: "w-full flex justify-center",
                                cardBox: "w-full",
                                card: "w-full bg-transparent shadow-none",
                            }
                        }}
                    />
                </div>

                {/* Additional Japanese-specific info */}
                <div className="mt-16 text-center text-[0.85rem] text-gray-500 leading-relaxed max-w-[600px] mx-auto">
                    <p className="mb-6">
                        登録することで
                        <Link href="/legal/terms" className="text-text font-bold hover:underline mx-1">利用規約</Link>、
                        <Link href="/legal/privacy" className="text-text font-bold hover:underline mx-1">個人情報の取り扱い</Link>
                        に同意したものとみなされます。
                    </p>
                    <div className="flex justify-center gap-6 opacity-30">
                        <img src="/images/logo.png" alt="AcadeMina" className="h-8 grayscale" />
                    </div>
                </div>
            </div>
        </main>
    );
}