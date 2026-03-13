import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding data...");

    // 1. サンプル教材データ (Exams)
    const exams = [
        {
            id: "sample-001",
            category: "工学系",
            title: "【サンプル】東大 工学系 院試対策パック",
            price: 2980,
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
            description: "東大工学系研究科の院試対策に特化した、過去問解説と勉強法のセットです。",
        },
        {
            id: "sample-002",
            category: "情報系",
            title: "【サンプル】京大 情報学 体験記 + 過去問解説",
            price: 1980,
            image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
            description: "京都大学情報学研究科の合格者が執筆した、詳細な体験記と過去問の解答例です。",
        },
        {
            id: "sample-003",
            category: "理学系",
            title: "【サンプル】阪大 物理 院試攻略ノート",
            price: 1480,
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
            description: "大阪大学理学研究科物理学専攻の重要問題をまとめた攻略ノートです。",
        },
    ];

    for (const exam of exams) {
        await prisma.exam.upsert({
            where: { id: exam.id },
            update: exam,
            create: exam,
        });
    }

    // 2. サンプル研究室データ (Labs)
    const labs = [
        {
            id: "sample-lab-001",
            university: "東京大学",
            name: "サンプル研究室（AI・データサイエンス）",
            tags: ["AI", "データサイエンス", "機械学習"],
            heroImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
            website: "https://example.com/lab1",
            about: "最先端のAI技術とデータサイエンスを駆使して、社会課題の解決を目指す研究室です。",
            profName: "山田 太郎 教授",
            profImage: "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=400&q=80",
            message: "研究は、未知の扉を開く冒険です。共に挑戦しましょう。",
            contact: "prof-yamada@example.ac.jp",
        },
    ];

    for (const lab of labs) {
        await prisma.lab.upsert({
            where: { id: lab.id },
            update: lab,
            create: lab,
        });
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
