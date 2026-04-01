import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, preferredSlots, message, paymentMethodId } = body;

    if (!type || !paymentMethodId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;
    const profile = await prisma.profile.findFirst({
        where: { OR: [{ id: userId }, ...(email ? [{ email }] : [])] },
    });
    if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    const profileId = profile.id;

    // 現在のサービス料金を取得
    const servicePrice = await prisma.servicePrice.findUnique({ where: { type } });
    if (!servicePrice) {
        return NextResponse.json({ error: "Service price not found" }, { status: 404 });
    }

    // Stripe Customerを作成（またはすでに存在する場合は取得）
    let stripeCustomerId: string;
    const existingRequests = await prisma.mentorRequest.findFirst({
        where: { profileId, stripeCustomerId: { not: null } },
        select: { stripeCustomerId: true },
    });

    if (existingRequests?.stripeCustomerId) {
        stripeCustomerId = existingRequests.stripeCustomerId;
    } else {
        const customer = await stripe.customers.create({
            email: profile.email,
            name: `${profile.lastName} ${profile.firstName}`,
        });
        stripeCustomerId = customer.id;
    }

    // カードをCustomerに紐付け
    await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId });
    await stripe.customers.update(stripeCustomerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
    });

    // 申込レコードを作成
    const request = await prisma.mentorRequest.create({
        data: {
            profileId,
            type,
            preferredSlots: preferredSlots ?? null,
            message: message ?? null,
            price: servicePrice.price,
            stripeCustomerId,
            stripePaymentMethodId: paymentMethodId,
        },
    });

    return NextResponse.json({ id: request.id });
}
