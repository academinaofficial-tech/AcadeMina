import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/about",
    "/contact",
    "/column",
    "/column-detail(.*)", // 念のためコラム詳細もワイルドカードに
    "/exam",              // ✅ 合格体験記の「まとめページ」は公開
    "/news",
    "/legal",
    "/lab",
    "/story",
    "/api/webhooks/clerk",
    "/account/login(.*)",
    "/account/signup(.*)",
]);

export default clerkMiddleware((auth, req) => {
    // 公開ルートでない場合は保護（ログインへ飛ばす）
    if (!isPublicRoute(req)) auth().protect();
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};