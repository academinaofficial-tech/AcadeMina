import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY || "sk_test_build_time_placeholder";

export const stripe = new Stripe(secretKey, {
    apiVersion: "2024-06-20" as any, // 使用するAPIバージョン
});