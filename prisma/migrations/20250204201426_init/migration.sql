-- CreateTable
CREATE TABLE "Assistant" (
    "appId" TEXT NOT NULL PRIMARY KEY,
    "oaiId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Assistant_oaiId_key" ON "Assistant"("oaiId");
