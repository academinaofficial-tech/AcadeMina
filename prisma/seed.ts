import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

type UniversityRow = {
  name: string;
  tags: string;
  level?: string;
  area?: string;
};

type FacultyRow = {
  university_name: string;
  faculty_name: string;
};

type DepartmentRow = {
  university_name: string;
  faculty_name: string;
  department_name: string;
};

type ThemeGroupRow = {
  name: string;
};

type ThemeRow = {
  theme_group_name: string;
  theme_name: string;
};

function normalizeHeader(header: string): string {
  return header
    .replace(/\uFEFF/g, "")
    .replace(/\s+/g, "")
    .trim()
    .toLowerCase();
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result.map((v) => v.trim());
}

function parseCsv(filePath: string): Record<string, string>[] {
  const raw = fs
    .readFileSync(filePath, "utf-8")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const lines = raw.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) return [];

  const headers = splitCsvLine(lines[0]).map((h) => normalizeHeader(h));

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = (values[index] ?? "").trim();
    });

    return row;
  });
}

function parseTags(tags: string | undefined): string[] {
  if (!tags) return [];
  return tags
    .split("|")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

async function main() {
  const baseDir = path.join(process.cwd(), "prisma", "csv");

  const universityPath = path.join(baseDir, "university.csv");
  const facultyPath = path.join(baseDir, "faculty.csv");
  const departmentPath = path.join(baseDir, "department.csv");
  const themeGroupPath = path.join(baseDir, "theme-groups.csv");
  const themePath = path.join(baseDir, "themes.csv");

  const universityRows = parseCsv(universityPath) as unknown as UniversityRow[];
  const facultyRows = parseCsv(facultyPath) as unknown as FacultyRow[];
  const departmentRows = parseCsv(departmentPath) as unknown as DepartmentRow[];
  const themeGroupRows = fs.existsSync(themeGroupPath)
    ? (parseCsv(themeGroupPath) as unknown as ThemeGroupRow[])
    : [];
  const themeRows = fs.existsSync(themePath)
    ? (parseCsv(themePath) as unknown as ThemeRow[])
    : [];

  console.log("Start cleanup...");

  await prisma.lab.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.department.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.university.deleteMany();

  // Theme は ThemeGroup の子なので先に Theme を消してから ThemeGroup を消す
  await prisma.theme.deleteMany();
  await prisma.themeGroup.deleteMany();

  console.log("Import universities...");

  const universityMap = new Map<string, string>();

  for (const row of universityRows) {
    const name = row.name?.trim();
    if (!name) continue;

    const university = await prisma.university.create({
      data: {
        name,
        tags: parseTags(row.tags),
        level: row.level?.trim() || null,
        area: row.area?.trim() || null,
      },
    });

    universityMap.set(name, university.id);
  }

  console.log("Import faculties...");

  const facultyMap = new Map<string, string>();

  for (const row of facultyRows) {
    const universityName = row.university_name?.trim();
    const facultyName = row.faculty_name?.trim();

    if (!universityName || !facultyName) continue;

    const universityId = universityMap.get(universityName);
    if (!universityId) {
      console.warn(`Skip faculty: university not found -> ${universityName} / ${facultyName}`);
      continue;
    }

    const faculty = await prisma.faculty.upsert({
      where: {
        universityId_name: {
          universityId,
          name: facultyName,
        },
      },
      update: {},
      create: {
        name: facultyName,
        universityId,
      },
    });

    facultyMap.set(`${universityName}___${facultyName}`, faculty.id);
  }

  console.log("Import departments...");

  for (const row of departmentRows) {
    const universityName = row.university_name?.trim();
    const facultyName = row.faculty_name?.trim();
    const departmentName = row.department_name?.trim();

    if (!universityName || !facultyName || !departmentName) continue;

    const facultyId = facultyMap.get(`${universityName}___${facultyName}`);
    if (!facultyId) {
      console.warn(
        `Skip department: faculty not found -> ${universityName} / ${facultyName} / ${departmentName}`
      );
      continue;
    }

    await prisma.department.upsert({
      where: {
        facultyId_name: {
          facultyId,
          name: departmentName,
        },
      },
      update: {},
      create: {
        name: departmentName,
        facultyId,
      },
    });
  }

  console.log("Import theme groups...");

  const themeGroupMap = new Map<string, string>();

  for (const row of themeGroupRows) {
    const name = row.name?.trim();
    if (!name) continue;

    const themeGroup = await prisma.themeGroup.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    themeGroupMap.set(name, themeGroup.id);
  }

  console.log("Import themes...");

  for (const row of themeRows) {
    const themeGroupName = row.theme_group_name?.trim();
    const themeName = row.theme_name?.trim();

    if (!themeGroupName || !themeName) continue;

    let themeGroupId = themeGroupMap.get(themeGroupName);

    if (!themeGroupId) {
      const themeGroup = await prisma.themeGroup.upsert({
        where: { name: themeGroupName },
        update: {},
        create: { name: themeGroupName },
      });

      themeGroupId = themeGroup.id;
      themeGroupMap.set(themeGroupName, themeGroupId);
    }

    await prisma.theme.upsert({
      where: {
        themeGroupId_name: {
          themeGroupId,
          name: themeName,
        },
      },
      update: {},
      create: {
        name: themeName,
        themeGroupId,
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });