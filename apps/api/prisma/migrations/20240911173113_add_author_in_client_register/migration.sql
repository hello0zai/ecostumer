-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "author_id" TEXT;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
