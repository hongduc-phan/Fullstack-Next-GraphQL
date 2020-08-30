import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
  @Field(() => String)
  @PrimaryKey()
  id!: String;

  @Field(() => String)
  @Property({
    type: 'date',
    nullable: true,
    // defaultRaw: new Date().toDateString(),
    onCreate: () => new Date(),
  })
  createAt = new Date();

  @Field(() => String)
  @Property({
    type: 'date',
    // defaultRaw: new Date().toDateString(),
    onUpdate: () => new Date(),
    nullable: true,
  })
  updateAt = new Date();

  @Field()
  @Property({ type: 'text', unique: true })
  username!: string;

  // not have @Field here because I donot want to show it in Graphql API ( it is private)
  @Property({ type: 'text' })
  password!: string;
}
