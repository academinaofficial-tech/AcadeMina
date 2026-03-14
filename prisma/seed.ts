import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Cleanup existing data...");
    await prisma.lab.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.department.deleteMany();
    await prisma.university.deleteMany();

    console.log("Seeding rich documentation data...");

    // 1. 大学データの投入
    const univTokyo = await prisma.university.upsert({
        where: { id: "univ-tokyo" },
        update: {},
        create: {
            id: "univ-tokyo",
            name: "東京大学",
            tags: ["国立", "Sランク", "関東"],
            level: "S",
            area: "東京",
        },
    });

    const univKyoto = await prisma.university.upsert({
        where: { id: "univ-kyoto" },
        update: {},
        create: {
            id: "univ-kyoto",
            name: "京都大学",
            tags: ["国立", "Sランク", "関西"],
            level: "S",
            area: "京都",
        },
    });

    // 2. 学科データの投入
    const deptInfo = await prisma.department.upsert({
        where: { id: "dept-it-tokyo" },
        update: {},
        create: {
            id: "dept-it-tokyo",
            name: "情報理工学系研究科",
            theme: "コンピュータサイエンス",
            universityId: univTokyo.id,
        },
    });

    const deptEngKyoto = await prisma.department.upsert({
        where: { id: "dept-eng-kyoto" },
        update: {},
        create: {
            id: "dept-eng-kyoto",
            name: "工学研究科",
            theme: "機械・電子工学",
            universityId: univKyoto.id,
        },
    });

    // 3. 研究室データの投入 (詳細情報付き)
    const labData = {
        id: "lab-sample-001",
        universityId: univTokyo.id,
        universityName: univTokyo.name,
        departmentId: deptInfo.id,
        name: "田中情報学研究室",
        tags: ["AI", "自然言語処理", "Deep Learning"],
        heroImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
        website: "https://example.com/tanaka-lab",
        profName: "田中 健一 教授",
        profImage: "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=400&q=80",
        about: "当研究室では、大規模言語モデル（LLM）を用いた次世代のコミュニケーション基盤の研究を行っています。理論と実装の両面から、人間の知性に迫るアプローチを模索しています。",
        message: "研究は、誰も見たことのない景色を最初に見つける旅です。知的好奇心旺盛な学生の挑戦を待っています。",
        contact: {
            prof: "tanaka@univ-tokyo.ac.jp",
            assistant: "office-tanaka@univ-tokyo.ac.jp"
        },
        papers: [
            { title: "Attention is All You Need? A deeper look into LLMs", summary: "Transformerモデルの限界と進化について論じた最新論文です。", link: "https://arxiv.org/example1" },
            { title: "Efficient Training of Giant Models", summary: "限られた基盤リソースでの巨大モデル学習手法に関する研究です。", link: "https://arxiv.org/example2" }
        ],
        stats: { gender: 15, international: 40, working: 10 }
    };

    await prisma.lab.upsert({
        where: { id: labData.id },
        update: labData,
        create: labData,
    });

    const labKyoto = {
        id: "lab-sample-002",
        universityId: univKyoto.id,
        universityName: univKyoto.name,
        departmentId: deptEngKyoto.id,
        name: "佐藤エンジニアリング研究室",
        tags: ["ロボティクス", "制御", "IoT"],
        heroImage: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80",
        website: "https://example.com/sato-lab",
        profName: "佐藤 浩二 教授",
        profImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        about: "自律走行ロボットやスマートシティのためのIoT基盤を研究しています。実機を用いた実験を重視しています。",
        message: "技術で世界を動かしたい、そんな情熱を持った学生を歓迎します。",
        contact: { prof: "sato@univ-kyoto.ac.jp", assistant: "sato-lab@univ-kyoto.ac.jp" },
        papers: [],
        stats: { gender: 20, international: 10, working: 5 }
    };

    await prisma.lab.upsert({
        where: { id: labKyoto.id },
        update: labKyoto,
        create: labKyoto,
    });

    // 4. 教材データ (Exams) の投入
    const exams = [
        {
            id: "exam-001",
            title: "東大 情報理工 過去問解答セット (2020-2024)",
            price: 3500,
            category: "past-exam",
            image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
            description: "東京大学 情報理工学系研究科の数学と専門科目の過去問解答・解説集です。合格者が詳しく解説しています。",
            author: "東大情報理工合格者有志",
            contents: ["院試数学 解答集", "専門科目（計算機科学）解説", "推奨参考書リスト", "合格体験記・戦略"],
            preview: "まず、基礎的な線形代数と微分積分を完璧にすることが合格への近道です。特に固有値問題は...",
            deptId: "dept-it-tokyo"
        },
        {
            id: "exam-002",
            title: "京大 工学研究科 専門科目 対策問題集",
            price: 2800,
            category: "practice",
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
            description: "京都大学 工学研究科 機械工学専攻の対策に特化したオリジナル問題集です。",
            author: "京大工学研究科 OB",
            contents: ["力学 演習問題 50問", "熱力学 重要ポイント解説", "制御工学 頻出パターン"],
            preview: "京大の工学研究科の物理は、基礎を応用する力が問われます。この問題集では...",
            deptId: "dept-eng-kyoto"
        }
    ];

    for (const exam of exams) {
        await prisma.exam.upsert({
            where: { id: exam.id },
            update: exam,
            create: exam,
        });
    }

    console.log("Seeding finished successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
