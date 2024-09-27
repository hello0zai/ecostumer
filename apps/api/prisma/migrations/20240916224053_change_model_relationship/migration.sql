/*
  Warnings:

  - You are about to drop the column `productId` on the `purchases` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_productId_fkey";

-- DropIndex
DROP INDEX "purchases_productId_purchase_date_idx";

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "purchase_products" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "purchaseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "purchase_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchase_products_purchaseId_productId_key" ON "purchase_products"("purchaseId", "productId");

-- CreateIndex
CREATE INDEX "purchases_purchase_date_idx" ON "purchases"("purchase_date");

-- AddForeignKey
ALTER TABLE "purchase_products" ADD CONSTRAINT "purchase_products_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_products" ADD CONSTRAINT "purchase_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
