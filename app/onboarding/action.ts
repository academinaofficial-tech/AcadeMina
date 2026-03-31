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
    const finalFaculty = formData.get("finalFaculty") as string;
    const finalDepartment = formData.get("finalDepartment") as string;
    const grade = formData.get("grade") as string;
    const careerPath = formData.get("careerPath") as string;

    const targetSchools = [];
    for (let i = 0; i < 3; i++) {
        const univ = formData.get(`target_${i}_univ`) as string;
        const faculty = formData.get(`target_${i}_faculty`) as string;
        const dept = formData.get(`target_${i}_dept`) as string;
        if (univ && univ.trim() !== "") {
            targetSchools.push({
                univ: univ.trim(),
                faculty: faculty ? faculty.trim() : "",
                dept: dept ? dept.trim() : ""
            });
        }
    }

    const themeIds = formData.getAll("themes") as string[];

    await prisma.profile.upsert({
        where: { id: userId },
        update: {
            university: finalUniversity,
            faculty: finalFaculty,
            department: finalDepartment,
            grade,
            careerPath,
            targetSchools: targetSchools,
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
            faculty: finalFaculty,
            department: finalDepartment,
            grade,
            careerPath,
            targetSchools: targetSchools,
            interestThemes: {
                connect: themeIds.map((id) => ({ id })),
            },
        },
    });

    // ✅ リダイレクト先があればそこへ、なければマイページへ
    const redirectTo = formData.get("redirectTo") as string;
    redirect(redirectTo || "/mypage");
}