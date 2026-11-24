-- CreateTable
CREATE TABLE "OrdenServicio" (
    "id" SERIAL NOT NULL,
    "vehiculoPlaca" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "servicioId" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "OrdenServicio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrdenServicio_servicioId_idx" ON "OrdenServicio"("servicioId");

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
