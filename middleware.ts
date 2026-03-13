import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/about",
    "/contact",
    "/column",
    "/column-detail",
    "/exam",
    "/exam-detail",
    "/exam-store",
    "/product",
    "/news",
    "/legal",
    "/lab",
    "/api/webhooks/clerk",
    "/account/login(.*)",
    "/account/signup(.*)"
]);

export default clerkMiddleware((auth, req) => {
    if (!isPublicRoute(req)) auth().protect();
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
