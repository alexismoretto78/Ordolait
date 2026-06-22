-- CreateTable
CREATE TABLE "CompletedCommand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "whiteMassKg" DOUBLE PRECISION NOT NULL,
    "milkReceivedVolume" DOUBLE PRECISION NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "osmosedVolume" DOUBLE PRECISION NOT NULL,
    "milkType" TEXT NOT NULL,
    "isSkyr" BOOLEAN NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompletedCommand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" TEXT NOT NULL,
    "commandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "potsQty" INTEGER NOT NULL,
    "gramPerPot" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedReception" (
    "id" TEXT NOT NULL,
    "lotNumber" TEXT NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "milkType" TEXT NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompletedReception_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "CompletedCommand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
