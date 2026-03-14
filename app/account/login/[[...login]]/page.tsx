import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="min-h-screen pt-[180px] pb-[100px] bg-white">
            <div className="max-w-[800px] mx-auto px-5">
                {/* Custom Title Section */}
                <div className="text-center mb-12">
                    <h1 className="text-[2rem] font-black text-black inline-block relative pb-3 border-b-4 border-black">
                        ログイン
                    </h1>
                </div>

                {/* Clerk SignIn Component */}
                <div className="flex justify-center w-full">
                    <SignIn
                        routing="path"
                        path="/account/login"
                        signUpUrl="/account/signup"
                        appearance={{
                            elements: {
                                // globals.css で強力に上書きするため、ここでは最低限の指定のみ
                                rootBox: "w-full flex justify-center",
                                cardBox: "w-full",
                                card: "w-full bg-transparent shadow-none",
                            }
                        }}
                    />
                </div>

                {/* Additional Japanese-specific info */}
                <div className="mt-16 text-center text-[0.85rem] text-gray-500 leading-relaxed max-w-[600px] mx-auto">
                    <div className="flex justify-center gap-6 opacity-30">
                        <img src="/images/logo.png" alt="AcadeMina" className="h-8 grayscale" />
                    </div>
                </div>
            </div>
        </main>
    );
}
