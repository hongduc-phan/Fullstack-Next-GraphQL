import { Post } from './entities/Post';
import { __prod__ } from './constants';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { User } from './entities/User';

export default {
  migrations: {
    // tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    transactional: true, // wrap each migration in a transaction
    // disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    // dropTables: true, // allow to disable table dropping
    // safe: false, // allow to disable table and column dropping
    // emit: 'ts', // migration generation mode
  },
  entities: [Post, User],
  dbName: 'lireddit',
  type: 'postgresql',
  clientUrl: 'http://localhost:5432',
  user: 'phan',
  password: '1234',
  debug: !__prod__,
  // user: '',
  // password: '',
} as Parameters<typeof MikroORM.init>[0];
