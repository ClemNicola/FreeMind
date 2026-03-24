/*
  Warnings:

  - You are about to drop the column `context` on the `Thought` table. All the data in the column will be lost.
  - You are about to drop the column `current` on the `Thought` table. All the data in the column will be lost.
  - You are about to drop the column `legitimate` on the `Thought` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `Thought` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Thought` table. All the data in the column will be lost.
  - You are about to drop the column `trigger` on the `Thought` table. All the data in the column will be lost.
  - Added the required column `authTag` to the `Thought` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ciphertext` to the `Thought` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `Thought` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legitimateIndex` to the `Thought` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moodIndex` to the `Thought` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeIndex` to the `Thought` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wrappedMasterKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Thought" DROP COLUMN "context",
DROP COLUMN "current",
DROP COLUMN "legitimate",
DROP COLUMN "mood",
DROP COLUMN "time",
DROP COLUMN "trigger",
ADD COLUMN     "authTag" TEXT NOT NULL,
ADD COLUMN     "ciphertext" TEXT NOT NULL,
ADD COLUMN     "iv" TEXT NOT NULL,
ADD COLUMN     "legitimateIndex" TEXT NOT NULL,
ADD COLUMN     "moodIndex" TEXT NOT NULL,
ADD COLUMN     "timeIndex" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "wrappedMasterKey" TEXT NOT NULL;

-- DropEnum
DROP TYPE "MoodEnum";

-- DropEnum
DROP TYPE "TimeEnum";

-- CreateIndex
CREATE INDEX "Thought_userId_moodIndex_idx" ON "Thought"("userId", "moodIndex");

-- CreateIndex
CREATE INDEX "Thought_userId_timeIndex_idx" ON "Thought"("userId", "timeIndex");

-- CreateIndex
CREATE INDEX "Thought_userId_legitimateIndex_idx" ON "Thought"("userId", "legitimateIndex");

-- CreateIndex
CREATE INDEX "Thought_userId_moodIndex_timeIndex_idx" ON "Thought"("userId", "moodIndex", "timeIndex");
