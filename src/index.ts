import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
// import { Post } from './entities/Post';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import connectRedis from 'connect-redis';
import session from 'express-session';
import { MyContext } from 'types';

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  await app.use(
    session({
      name: 'qid_DucPhan',
      store: new RedisStore({
        client: redisClient,
        disableTTL: true,
        disableTouch: true,
        host: 'localhost',
        port: 4000,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'lax', //csrf
        secure: !__prod__, // collie only works in https
      },
      saveUninitialized: false,
      secret: 'Duc Phan is handsome 1234567890',
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log('server started on localhost: 4000');
  });
};

main().catch((e) => {
  console.log(e);
});
