/*
  Warnings:

  - You are about to drop the column `theme` on the `Department` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Department" DROP COLUMN "theme";

-- CreateTable
CREATE TABLE "ThemeGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThemeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "themeGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfileToTheme" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DepartmentToThemeGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LabToTheme" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ThemeGroup_name_key" ON "ThemeGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ThemeGroup_slug_key" ON "ThemeGroup"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_themeGroupId_name_key" ON "Theme"("themeGroupId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileToTheme_AB_unique" ON "_ProfileToTheme"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileToTheme_B_index" ON "_ProfileToTheme"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DepartmentToThemeGroup_AB_unique" ON "_DepartmentToThemeGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_DepartmentToThemeGroup_B_index" ON "_DepartmentToThemeGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LabToTheme_AB_unique" ON "_LabToTheme"("A", "B");

-- CreateIndex
CREATE INDEX "_LabToTheme_B_index" ON "_LabToTheme"("B");

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_themeGroupId_fkey" FOREIGN KEY ("themeGroupId") REFERENCES "ThemeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToTheme" ADD CONSTRAINT "_ProfileToTheme_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToTheme" ADD CONSTRAINT "_ProfileToTheme_B_fkey" FOREIGN KEY ("B") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentToThemeGroup" ADD CONSTRAINT "_DepartmentToThemeGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentToThemeGroup" ADD CONSTRAINT "_DepartmentToThemeGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "ThemeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabToTheme" ADD CONSTRAINT "_LabToTheme_A_fkey" FOREIGN KEY ("A") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabToTheme" ADD CONSTRAINT "_LabToTheme_B_fkey" FOREIGN KEY ("B") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
