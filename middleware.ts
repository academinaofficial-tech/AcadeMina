import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/about",
    "/contact",
    "/column(.*)",
    "/exam",
    "/exam/mentor",
    "/exam/qa",
    "/exam/product/(.*)",
    "/exam-store",
    "/story(.*)",
    "/news(.*)",
    "/legal",
    "/cart",
    "/api/webhooks/clerk",
    "/api/coupons/validate",
    "/api/admin/setup-db",
    "/account/login(.*)",
    "/account/signup(.*)",
    "/onboarding",
]);

export default clerkMiddleware((auth, req) => {
    if (!isPublicRoute(req)) {
        auth().protect();
    }
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};