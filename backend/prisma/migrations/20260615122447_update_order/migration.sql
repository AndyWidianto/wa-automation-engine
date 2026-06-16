/*
  Warnings:

  - You are about to drop the column `number` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `remoteJid` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "number",
DROP COLUMN "remoteJid";
