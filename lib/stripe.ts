import Stripe from "stripe";

// STRIPE_SECRET_KEY が未定義だとビルド時（Vercelの静的解析など）にクラッシュするため、
// 未定義の場合はダミーの文字列を入れておき、実行時にエラーにならないようにします。
const secretKey = process.env.STRIPE_SECRET_KEY || "sk_test_not_defined_yet";

export const stripe = new Stripe(secretKey, {
    apiVersion: "2024-06-20" as any, // 使用するAPIバージョン
});
