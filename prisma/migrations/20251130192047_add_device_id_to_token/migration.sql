/*
  Warnings:

  - The primary key for the `Token` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Token` DROP PRIMARY KEY,
    ADD COLUMN `deviceId` VARCHAR(100) NOT NULL DEFAULT 'legacy_device',
    ADD PRIMARY KEY (`userId`, `type`, `deviceId`);
