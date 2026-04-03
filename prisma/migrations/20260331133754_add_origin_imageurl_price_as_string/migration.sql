-- AlterTable
ALTER TABLE "products" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "origin" TEXT,
ALTER COLUMN "price" SET DATA TYPE TEXT;
