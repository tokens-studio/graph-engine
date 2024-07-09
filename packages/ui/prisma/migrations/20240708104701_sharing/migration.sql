/*
  Warnings:

  - You are about to drop the `Artifact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artifact" DROP CONSTRAINT "Artifact_invocationId_fkey";

-- DropForeignKey
ALTER TABLE "Invocation" DROP CONSTRAINT "Invocation_graphId_fkey";

-- AlterTable
ALTER TABLE "Graph" ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Artifact";

-- DropTable
DROP TABLE "Invocation";
