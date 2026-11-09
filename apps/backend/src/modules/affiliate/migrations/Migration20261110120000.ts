import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20261110120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table if exists "affiliate_commission" drop constraint if exists "affiliate_commission_status_check";`)
    this.addSql(`alter table if exists "affiliate_commission" add constraint "affiliate_commission_status_check" check ("status" in ('pending', 'approved', 'paid', 'void'));`)
    this.addSql(`alter table if exists "affiliate_commission" add column if not exists "customer_id" text null;`)
    this.addSql(`alter table if exists "affiliate_commission" add column if not exists "source" text check ("source" in ('initial', 'renewal')) not null default 'initial';`)
    this.addSql(`alter table if exists "affiliate" add column if not exists "payout_email" text null;`)
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "affiliate_commission" drop constraint if exists "affiliate_commission_status_check";`)
    this.addSql(`alter table if exists "affiliate_commission" add constraint "affiliate_commission_status_check" check ("status" in ('pending', 'approved', 'void'));`)
    this.addSql(`alter table if exists "affiliate_commission" drop column if exists "customer_id";`)
    this.addSql(`alter table if exists "affiliate_commission" drop column if exists "source";`)
    this.addSql(`alter table if exists "affiliate" drop column if exists "payout_email";`)
  }
}
