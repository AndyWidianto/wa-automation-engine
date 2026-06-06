-- AlterTable
ALTER TABLE "knowledges" ADD COLUMN     "productId" TEXT;

-- AddForeignKey
ALTER TABLE "knowledges" ADD CONSTRAINT "knowledges_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
