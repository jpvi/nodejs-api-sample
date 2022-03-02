import { Express } from 'express'
import { Knex } from 'knex'
import { Redis } from 'ioredis'

type HookContext = {
  server: Express
  db: Knex
  redis: Redis
}
