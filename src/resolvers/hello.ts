import { Resolver, Query } from 'type-graphql';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello7() {
    return 'hello world';
  }
}
