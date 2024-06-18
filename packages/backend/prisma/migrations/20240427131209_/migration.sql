-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Graph" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "graph" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "owner" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Graph" ("createdAt", "description", "graph", "id", "name", "owner", "tags", "updatedAt") SELECT "createdAt", "description", "graph", "id", "name", "owner", "tags", "updatedAt" FROM "Graph";
DROP TABLE "Graph";
ALTER TABLE "new_Graph" RENAME TO "Graph";
CREATE TABLE "new_Artifact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invocationId" TEXT NOT NULL,
    "artifact" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Artifact_invocationId_fkey" FOREIGN KEY ("invocationId") REFERENCES "Invocation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Artifact" ("artifact", "createdAt", "id", "invocationId", "updatedAt") SELECT "artifact", "createdAt", "id", "invocationId", "updatedAt" FROM "Artifact";
DROP TABLE "Artifact";
ALTER TABLE "new_Artifact" RENAME TO "Artifact";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
