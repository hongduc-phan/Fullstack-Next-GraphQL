import { Migration } from '@mikro-orm/migrations';

export class Migration20200829072011 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "create_at" jsonb not null, "update_at" jsonb not null, "title" varchar(255) not null);');
  }

}
