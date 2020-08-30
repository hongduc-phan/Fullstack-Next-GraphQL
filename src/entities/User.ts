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
    onCreate: () => new Date(),
    default: String(new Date()),
  })
  createAt = new Date();

  @Field(() => String)
  @Property({
    type: 'date',
    nullable: true,
    onUpdate: () => new Date(),
    default: String(new Date()),
  })
  updateAt = new Date();

  @Field(() => String)
  @Property({ type: 'text', unique: true })
  username!: string;

  // not have @Field here because I donot want to show it in Graphql API ( it is private)
  @Property({ type: 'text' })
  password!: string;
}
