import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 誰でも見れる「公開ルート」を定義（まとめページはここに入れる）
const isPublicRoute = createRouteMatcher([
    "/",
    "/about",
    "/contact",
    "/column(.*)",
    "/exam",
    "/exam/mentor",
    "/exam-store",
    "/story",             // ← 一覧ページのみ公開
    // "/story(.*)" は入れない → /story/[slug] はログイン必須になる
    "/news(.*)",
    "/legal",
    "/api/webhooks/clerk",
    "/account/login(.*)",
    "/account/signup(.*)",
]);

export default clerkMiddleware((auth, req) => {
    // ユーザーがアクセスしたページが「公開ルート」でない場合、
    // ログインしていなければ Clerk が自動でログイン画面に飛ばす
    if (!isPublicRoute(req)) {
        auth().protect();
    }
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};