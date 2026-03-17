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

    // 1. 現在の所属を受け取る
    const finalUniversity = formData.get("finalUniversity") as string;
    const finalFaculty = formData.get("finalFaculty") as string;
    const finalDepartment = formData.get("finalDepartment") as string;
    const grade = formData.get("grade") as string;
    const careerPath = formData.get("careerPath") as string;

    // 2. 志望校（最大3つ）を受け取ってJSON配列にする
    const targetSchools = [];
    for (let i = 0; i < 3; i++) {
        const univ = formData.get(`target_${i}_univ`) as string;
        const faculty = formData.get(`target_${i}_faculty`) as string;
        const dept = formData.get(`target_${i}_dept`) as string;
        
        // 大学名が入力されていれば配列に追加
        if (univ && univ.trim() !== "") {
            targetSchools.push({
                univ: univ.trim(),
                faculty: faculty ? faculty.trim() : "",
                dept: dept ? dept.trim() : ""
            });
        }
    }

    const themeIds = formData.getAll("themes") as string[];

    // 3. データベースに保存
    await prisma.profile.upsert({
        where: { id: userId },
        update: {
            university: finalUniversity,
            faculty: finalFaculty,       // 👈 新規追加
            department: finalDepartment,
            grade,
            careerPath,
            targetSchools: targetSchools, // 👈 新規追加 (JSONとして自動保存されます)
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
            faculty: finalFaculty,       // 👈 新規追加
            department: finalDepartment,
            grade,
            careerPath,
            targetSchools: targetSchools, // 👈 新規追加
            interestThemes: {
                connect: themeIds.map((id) => ({ id })),
            },
        },
    });

    redirect("/mypage");
}