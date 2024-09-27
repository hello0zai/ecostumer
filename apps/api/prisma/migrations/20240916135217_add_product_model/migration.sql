/*
  Warnings:

  - You are about to drop the column `service` on the `purchases` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "purchases_service_purchase_date_idx";

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "service",
ADD COLUMN     "productId" TEXT;

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "purchases_productId_purchase_date_idx" ON "purchases"("productId", "purchase_date");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
