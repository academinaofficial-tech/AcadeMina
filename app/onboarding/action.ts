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

    const finalUniversity = formData.get("finalUniversity") as string;
    const finalDepartment = formData.get("finalDepartment") as string;
    const grade = formData.get("grade") as string;
    const careerPath = formData.get("careerPath") as string;

    // 志望校（最大3つ）を取得して結合
    const targetList = [];
    for (let i = 0; i < 3; i++) {
        const targetStr = formData.get(`target_${i}`) as string;
        if (targetStr && targetStr.trim() !== "") {
            targetList.push(targetStr);
        }
    }
    const targetUniversityString = targetList.join(" | ");

    const themeIds = formData.getAll("themes") as string[];

    await prisma.profile.upsert({
        where: { id: userId },
        update: {
            university: finalUniversity,
            department: finalDepartment,
            grade,
            targetUniversity: targetUniversityString,
            careerPath,
            interestThemes: {
                set: themeIds.map((id) => ({ id })),
            },
        },
        create: {
            id: userId,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            university: finalUniversity,
            department: finalDepartment,
            grade,
            targetUniversity: targetUniversityString,
            careerPath,
            interestThemes: {
                connect: themeIds.map((id) => ({ id })),
            },
        },
    });

    redirect("/mypage");
}