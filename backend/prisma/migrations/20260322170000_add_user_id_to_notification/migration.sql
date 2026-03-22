-- AlterTable
ALTER TABLE "tb_notification"
ADD COLUMN "user_id" INTEGER;

-- CreateIndex
CREATE INDEX "tb_notification_user_id_idx" ON "tb_notification"("user_id");

-- AddForeignKey
ALTER TABLE "tb_notification"
ADD CONSTRAINT "tb_notification_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "tb_user"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
