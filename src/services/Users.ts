import { authenticate, create, tokenIsValid } from '../lib/helpers/users'
import { HookContext } from '../types'
// import { API_KEY } from './../conf'

/**
 * @param context HookContext provided by ../index.ts
 */
export const hook = async ({ server, db }: HookContext): Promise<void> => {

  server.post('/api/users/register', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
      return res.sendStatus(400)
    }

    try {
      return res.send(await create(db, username, password))
    } catch (ex) {
      return res.status(400).send({ message: ex })
    }
  })

  server.post('/api/users/authenticate', async (req, res) => {
    // check if username and password
    // exists in the request body
    const { username, password } = req.body
    if (!username || !password) {
      return res.sendStatus(400)
    }

    // try to authenticate
    try {
      return res.send(await authenticate(db, username, password))
    } catch (ex) {
      return res.status(400).send({ message: ex })
    }
  })

  server.post('/api/users/validate', async (req, res) => {
    // check if token exists
    const { token } = req.body
    if (!token) {
      return res.sendStatus(400)
    }

    // validate and return result
    return res.send(await tokenIsValid(db, token))
  })
}

export default { hook }
