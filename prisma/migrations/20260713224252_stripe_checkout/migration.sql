-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "stripe_checkout_session_id" VARCHAR(255);

-- CreateTable
CREATE TABLE "processed_stripe_events" (
    "id" VARCHAR(255) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_stripe_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_session_idx" ON "orders"("stripe_checkout_session_id");

