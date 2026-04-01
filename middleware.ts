import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/about",
    "/contact",
    "/column(.*)",
    "/exam",
    "/exam/mentor",
    "/exam-store",
    "/story(.*)",         // 一覧・詳細ページともに公開（SEOインデックス対応）
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