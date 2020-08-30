import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
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

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => [User], { nullable: true })
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length < 4) {
      return {
        errors: [
          {
            field: 'username',
            message: 'The length of username has at least 4 chars',
          },
        ],
      };
    }

    if (options.password.length < 8) {
      return {
        errors: [
          {
            field: 'password',
            message: 'The length of username has at least 8 chars',
          },
        ],
      };
    }

    const id = uuidv4();
    const hashedPassword = await argon2.hash(options.password);
    const user = await em.create(User, {
      id,
      username: String(options.username),
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.detail.includes) {
        return {
          errors: [
            {
              field: 'username',
              message: 'username already taken',
            },
          ],
        };
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await em.findOne(User, {
        username: String(options.username),
      });
      if (!user) {
        return {
          errors: [
            {
              field: 'username',
              message: 'That username doesnot exist',
            },
          ],
        };
      }

      const isValidUser = await argon2.verify(user.password, options.password);

      if (!isValidUser) {
        return {
          errors: [
            {
              field: 'password',
              message: 'That password is incorrect',
            },
          ],
        };
      }
      return { user };
    } catch (error) {
      throw new Error(error);
    }
  }
}
