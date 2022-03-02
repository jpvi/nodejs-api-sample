import dotenv from 'dotenv'

dotenv.config()

export const PORT = parseInt(process.env.PORT) || 4000
export const DEPLOYMENT = process.env.DEPLOYMENT || 'production'

// MYSQL
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || ''
export const MYSQL_USER = process.env.MYSQL_USER || ''
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || ''
export const MYSQL_HOST = process.env.MYSQL_HOST || ''
export const MYSQL_PORT = process.env.MYSQL_PORT
  ? parseInt(process.env.MYSQL_PORT)
  : 0

// Redis
export const REDIS_URI = process.env.REDIS_URI || ''

// Secret Key
export const SECRET_KEY = process.env.SECRET_KEY || ''