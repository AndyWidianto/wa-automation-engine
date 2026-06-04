-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "integration" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'disconnected';
