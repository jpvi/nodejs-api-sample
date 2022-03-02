import next from 'next'
import { HookContext } from './../types'

const hook = async ({ server }: HookContext) => {
  const dev = process.env.NODE_ENV !== 'production'
  const app = next({ dev })
  const handle = app.getRequestHandler()
  await app.prepare()
  server.all('*', (req, res) => handle(req, res))
}

export default { hook }
