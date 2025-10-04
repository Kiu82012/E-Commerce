-- AlterTable
ALTER TABLE `product` ADD COLUMN `ownerId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Product_ownerId_idx` ON `Product`(`ownerId`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
