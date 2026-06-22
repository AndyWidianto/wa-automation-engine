/*
  Warnings:

  - The `type` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `userId` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS');

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "metaJson" JSONB,
DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'INFO',
ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_userId_deletedAt_idx" ON "notifications"("userId", "deletedAt");
