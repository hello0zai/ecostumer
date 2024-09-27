/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[domain]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "organizations_slug_domain_key";

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_domain_key" ON "organizations"("domain");
