/*
  Warnings:

  - The primary key for the `Token` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Token` DROP PRIMARY KEY,
    MODIFY `type` ENUM('REFRESH', 'REFRESH_SECURE', 'RESET', 'VERIFY', 'DELETE', 'REFRESH_GOOGLE') NOT NULL,
    ADD PRIMARY KEY (`userId`, `type`);
