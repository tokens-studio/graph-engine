/*
  Warnings:

  - You are about to alter the column `graph` on the `Graph` table. The data in that column could be lost. The data in that column will be cast from `String` to `Binary`.

*/
-- CreateTable
CREATE TABLE "Invocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "graphId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME NOT NULL,
    CONSTRAINT "Invocation_graphId_fkey" FOREIGN KEY ("graphId") REFERENCES "Graph" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invocationId" TEXT NOT NULL,
    "artifact" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Artifact_invocationId_fkey" FOREIGN KEY ("invocationId") REFERENCES "Invocation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Graph" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "graph" BLOB NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "owner" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Graph" ("createdAt", "graph", "id", "name", "owner", "updatedAt") SELECT "createdAt", "graph", "id", "name", "owner", "updatedAt" FROM "Graph";
DROP TABLE "Graph";
ALTER TABLE "new_Graph" RENAME TO "Graph";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
