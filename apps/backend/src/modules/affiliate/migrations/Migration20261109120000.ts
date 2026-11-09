import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20261109120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "affiliate" ("id" text not null, "code" text not null, "email" text not null, "name" text not null, "status" text check ("status" in ('pending', 'active', 'rejected')) not null default 'pending', "commission_rate" integer not null default 20, "customer_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "affiliate_pkey" primary key ("id"));`)
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_affiliate_code_unique" ON "affiliate" ("code") WHERE deleted_at IS NULL;`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_affiliate_deleted_at" ON "affiliate" ("deleted_at") WHERE deleted_at IS NULL;`)
    this.addSql(`create table if not exists "affiliate_commission" ("id" text not null, "affiliate_id" text not null, "order_id" text not null, "referral_code" text not null, "base_amount" integer not null, "commission_amount" integer not null, "currency_code" text not null default 'usd', "status" text check ("status" in ('pending', 'approved', 'void')) not null default 'pending', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "affiliate_commission_pkey" primary key ("id"));`)
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_affiliate_commission_order_id_unique" ON "affiliate_commission" ("order_id") WHERE deleted_at IS NULL;`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_affiliate_commission_affiliate_id" ON "affiliate_commission" ("affiliate_id") WHERE deleted_at IS NULL;`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_affiliate_commission_deleted_at" ON "affiliate_commission" ("deleted_at") WHERE deleted_at IS NULL;`)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "affiliate_commission" cascade;`)
    this.addSql(`drop table if exists "affiliate" cascade;`)
  }
}
