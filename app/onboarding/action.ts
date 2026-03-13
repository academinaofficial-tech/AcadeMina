"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function submitOnboarding(formData: FormData) {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("Unauthorized");
    }

    const university = formData.get("university") as string;
    const grade = formData.get("grade") as string;
    const targetUniversity = formData.get("targetUniversity") as string;
    const interests = formData.getAll("interests") as string[];
    const careerPath = formData.get("careerPath") as string;

    await prisma.profile.upsert({
        where: { id: userId },
        update: {
            university,
            grade,
            targetUniversity,
            interests,
            careerPath,
        },
        create: {
            id: userId,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            university,
            grade,
            targetUniversity,
            interests,
            careerPath,
        },
    });

    redirect("/mypage");
}
