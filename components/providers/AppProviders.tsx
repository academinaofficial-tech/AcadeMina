import { ClerkProvider } from "@clerk/nextjs";
import { jaJP } from "@clerk/localizations";

export default function AppProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider
            localization={{
                ...jaJP,
                signUp: {
                    start: {
                        actionText: "すでに会員の方はこちらから",
                        actionLink: "ログイン",
                    },
                },
                signIn: {
                    start: {
                        actionText: "新規会員登録はこちらから",
                        actionLink: "会員登録",
                    },
                },
            } as any}
        >
            {children}
        </ClerkProvider>
    );
}
