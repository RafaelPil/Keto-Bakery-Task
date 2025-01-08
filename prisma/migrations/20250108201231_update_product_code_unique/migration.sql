/*
  Warnings:

  - A unique constraint covering the columns `[productCode]` on the table `ModifiedProduct` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productCode]` on the table `OriginalProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ModifiedProduct_productCode_key" ON "ModifiedProduct"("productCode");

-- CreateIndex
CREATE UNIQUE INDEX "OriginalProduct_productCode_key" ON "OriginalProduct"("productCode");
