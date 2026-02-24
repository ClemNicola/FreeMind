/*
  Warnings:

  - Added the required column `mood` to the `Thought` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MoodEnum" AS ENUM ('DEPRESSION', 'ANGER', 'SHAME', 'REGRETS', 'TRAUMA', 'ADDICTIONS', 'PARANOIA', 'ANXIETY', 'FEAR', 'ANTICIPATION', 'WORRY', 'STRESS');

-- AlterTable
ALTER TABLE "Thought" ADD COLUMN     "mood" "MoodEnum" NOT NULL;
