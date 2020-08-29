import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class Post {
  @Field(() => String)
  @PrimaryKey()
  id!: String;

  @Field(() => String)
  @Property({ type: 'date', nullable: true, onCreate: () => new Date() })
  createAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', nullable: true, onUpdate: () => new Date() })
  updateAt = new Date();

  @Field(() => String)
  @Property({ type: 'text' })
  title: string;
}
