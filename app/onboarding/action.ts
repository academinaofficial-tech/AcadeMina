"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function submitOnboarding(formData: FormData) {
    const { userId } = await auth();
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

    const email = user.emailAddresses[0].emailAddress;
    const updateData = {
        university: finalUniversity,
        faculty: finalFaculty,
        department: finalDepartment,
        grade,
        careerPath,
        targetSchools: targetSchools,
        interestThemes: {
            set: themeIds.map((id) => ({ id })),
        },
    };

    // 同メールのプロフィールが既存の場合はそちらを更新
    const existingByEmail = await prisma.profile.findUnique({ where: { email } });
    if (existingByEmail && existingByEmail.id !== userId) {
        await prisma.profile.update({ where: { email }, data: updateData });
    } else {
        await prisma.profile.upsert({
            where: { id: userId },
            update: updateData,
            create: {
                id: userId,
                email,
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
    }

    // リダイレクト先があればそこへ、なければマイページへ
    const redirectTo = formData.get("redirectTo") as string;
    redirect(redirectTo || "/mypage");
}
