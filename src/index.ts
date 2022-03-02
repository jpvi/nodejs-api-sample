import express from 'express'
import knex from 'knex'
import Redis from 'ioredis'
import migrate from './lib/migrate'
import Users from './services/Users'
import GitHub from './services/GitHub'
import Next from './services/Next'
import { HookContext } from './types'
import {
  DEPLOYMENT,
  PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  REDIS_URI
} from './conf'

const main = async () => {
  const dev = process.env.NODE_ENV !== 'production'

  // setup the express server
  const server = express()
  server.disable('x-powered-by')
  server.use(express.json())
  server.use(express.urlencoded({ extended: true }))

  // now setup the knex connection
  const connection = {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE
  }

  const db = knex({
    client: 'mysql2',
    connection
  })
  
  // migrate the database
  await migrate(db)

  // now create the connection to redis
  const redis = new Redis(REDIS_URI)

  // Setup the hook context
  const ctx: HookContext = { server, db, redis }

  // Register all the current server hooks
  await Users.hook(ctx)
  await GitHub.hook(ctx)
  await Next.hook(ctx)

  // We're good to go
  server.listen(PORT, () => {
    console.log(`Service listening on ${PORT}`)
  })
}

main()
