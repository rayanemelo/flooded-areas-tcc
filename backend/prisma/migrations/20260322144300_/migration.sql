-- CreateTable
CREATE TABLE "tb_faq" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_user_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_admin_password_attempts" (
    "id" SERIAL NOT NULL,
    "user_admin_id" INTEGER NOT NULL,
    "attempts_count" INTEGER NOT NULL,
    "last_attempt_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_user_admin_password_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_notification" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_alert_preference" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "tb_user_alert_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_device" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "push_token" TEXT NOT NULL,

    CONSTRAINT "tb_user_device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_code" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "date_exp" TIMESTAMP(3) NOT NULL,
    "attempts_count" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_flood_area" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "flood_level_id" INTEGER NOT NULL,
    "comments_admin" TEXT,
    "yes_count" INTEGER NOT NULL DEFAULT 0,
    "no_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_flood_area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_flood_area_ai_analysis" (
    "id" SERIAL NOT NULL,
    "flood_area_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_flood" BOOLEAN,
    "confidence" DOUBLE PRECISION,
    "veracity_score" DOUBLE PRECISION,
    "analysis" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_flood_area_ai_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_flood_level" (
    "id" SERIAL NOT NULL,
    "level" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_flood_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "flood_area_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_admin_email_key" ON "tb_user_admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_admin_password_attempts_user_admin_id_key" ON "tb_user_admin_password_attempts"("user_admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_phone_key" ON "tb_user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_alert_preference_user_id_state_city_key" ON "tb_user_alert_preference"("user_id", "state", "city");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_device_push_token_key" ON "tb_user_device"("push_token");

-- CreateIndex
CREATE UNIQUE INDEX "tb_code_user_id_key" ON "tb_code"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_flood_area_ai_analysis_flood_area_id_key" ON "tb_flood_area_ai_analysis"("flood_area_id");

-- AddForeignKey
ALTER TABLE "tb_user_admin_password_attempts" ADD CONSTRAINT "tb_user_admin_password_attempts_user_admin_id_fkey" FOREIGN KEY ("user_admin_id") REFERENCES "tb_user_admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_alert_preference" ADD CONSTRAINT "tb_user_alert_preference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_device" ADD CONSTRAINT "tb_user_device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_code" ADD CONSTRAINT "tb_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_flood_area" ADD CONSTRAINT "tb_flood_area_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_flood_area" ADD CONSTRAINT "tb_flood_area_flood_level_id_fkey" FOREIGN KEY ("flood_level_id") REFERENCES "tb_flood_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_flood_area_ai_analysis" ADD CONSTRAINT "tb_flood_area_ai_analysis_flood_area_id_fkey" FOREIGN KEY ("flood_area_id") REFERENCES "tb_flood_area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_images" ADD CONSTRAINT "tb_images_flood_area_id_fkey" FOREIGN KEY ("flood_area_id") REFERENCES "tb_flood_area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
