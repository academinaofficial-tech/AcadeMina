import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const profile = await prisma.profile.findFirst({
        where: { OR: [{ id: userId }, { email }] },
    });

    const profileId = profile?.id ?? userId;
    const customerEmail = profile?.email ?? email;
    const customerName = profile
        ? `${profile.lastName} ${profile.firstName}`
        : `${clerkUser.lastName || ""} ${clerkUser.firstName || ""}`.trim();

    // 既存のStripe CustomerIDを探す
    const existing = await prisma.mentorRequest.findFirst({
        where: { profileId, stripeCustomerId: { not: null } },
        select: { stripeCustomerId: true },
    });

    let customerId = existing?.stripeCustomerId;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: customerEmail,
            name: customerName,
        });
        customerId = customer.id;
    }

    const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ["card"],
    });

    return NextResponse.json({
        clientSecret: setupIntent.client_secret,
        customerId,
    });
}
