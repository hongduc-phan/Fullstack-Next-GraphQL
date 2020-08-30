import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
} from 'type-graphql';
import argon2 from 'argon2';
import { MyContext } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/User';

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: String;
  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User], { nullable: true })
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<User> {
    try {
      const id = uuidv4();
      const hashedPassword = await argon2.hash(options.password);
      const user = em.create(User, {
        id,
        username: String(options.username),
        password: hashedPassword,
      });
      await em.persistAndFlush(user);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
