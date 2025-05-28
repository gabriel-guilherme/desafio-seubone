-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cut" (
    "id" SERIAL NOT NULL,
    "modelo" TEXT NOT NULL,
    "ordem_exibicao" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "tipo_recorte" TEXT NOT NULL,
    "posicao_recorte" TEXT NOT NULL,
    "tipo_produto" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "cor_material" TEXT NOT NULL,
    "url_imagem" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cut_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cut_sku_key" ON "Cut"("sku");
