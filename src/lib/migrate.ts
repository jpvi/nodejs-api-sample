import path from 'path'
import glob from 'glob'
import fs from 'fs'
import { Knex } from 'knex'

const migrate = async (db: Knex) => {
  const dir = path.join(__dirname, '..', '..', 'migrations')
  // Create the main migration table
  await db.raw(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL UNIQUE NOT NULL PRIMARY KEY,
      file VARCHAR(255) NOT NULL,
      migrated_at TIMESTAMP DEFAULT NOW()
    );
  `)

  // run migrations
  const migrationsInDb = await db('migrations').select('file')
  const migrationsAlreadyRun = migrationsInDb.map(({ file }) => file)
  const migrationFiles = glob
    .sync('*', { cwd: dir })
    .filter(f => !migrationsAlreadyRun.includes(path.parse(f).name))
    .sort((a, b) => (a > b ? 1 : -1))
  for (const file of migrationFiles) {
    try {
      const sql = fs.readFileSync(path.join(dir, file), 'utf8')
      await db.raw(sql)
      await db('migrations').insert({
        file: path.parse(file).name
      })
    } catch (err) {
      console.error(err)
    }
  }
}

export default migrate
