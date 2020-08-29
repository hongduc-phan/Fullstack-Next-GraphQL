import { Migration } from '@mikro-orm/migrations';

export class Migration20200829102348 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" varchar(255) not null, "create_at" timestamptz(0) null, "update_at" timestamptz(0) null, "title" text not null);');
    this.addSql('alter table "post" add constraint "post_pkey" primary key ("id");');
  }

}
