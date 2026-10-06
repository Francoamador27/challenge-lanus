-- Domain rules that the Prisma schema language cannot express.
ALTER TABLE "movements" ADD CONSTRAINT "movements_amount_cents_positive" CHECK ("amount_cents" > 0);
ALTER TABLE "cards" ADD CONSTRAINT "cards_last4_digits" CHECK ("last4" ~ '^[0-9]{4}$');
ALTER TABLE "cards" ADD CONSTRAINT "cards_exp_month_range" CHECK ("exp_month" BETWEEN 1 AND 12);
ALTER TABLE "cards" ADD CONSTRAINT "cards_balance_cents_non_negative" CHECK ("balance_cents" >= 0);
