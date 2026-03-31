import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/about",
    "/contact",
    "/column(.*)",
    "/exam",
    "/exam-store",
    "/story",             // ← 一覧ページのみ公開
    // "/story(.*)" は入れない → /story/[slug] はログイン必須になる
    "/news(.*)",
    "/legal",
    "/api/webhooks/clerk",
    "/account/login(.*)",
    "/account/signup(.*)",
    "/onboarding",        // ← オンボーディング自体は認証後にアクセスするが公開ルートに入れておく
]);

export default clerkMiddleware((auth, req) => {
    if (!isPublicRoute(req)) {
        auth().protect();
    }
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};