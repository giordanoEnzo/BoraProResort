-- CreateTable
CREATE TABLE "ResortImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "resortId" TEXT NOT NULL,
    CONSTRAINT "ResortImage_resortId_fkey" FOREIGN KEY ("resortId") REFERENCES "Resort" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
