import { Knex } from 'knex'
import { compare, hash } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { SECRET_KEY } from '../../conf'
import { uuid } from 'uuidv4'

export const authenticate = async (
  db: Knex,
  username: String,
  password: String
) => {

  // check if user exists
  // then check if password is correct
  const user = await db('users').select('*').where({ username }).first()
  if (!user || !(await compare(password.toString(), user.hash))) {
    console.debug(
      `User failed to authenticate => Username '${username}'`
    )
    throw 'Username or password is incorrect'
  }

  // generate a token
  const token = sign({ sub: user.id }, SECRET_KEY, { expiresIn: '1d' })

  console.log(
    `User successfully authenticated => Username '${username}'`
  )
  // return authentication details
  return {
    id: user.id,
    username: user.username,
    token
  }
}

export const create = async (
  db: Knex,
  username: String,
  password: String
) => {

  // validate if username exists
  const user = await db('users').select('*').where({ username }).first()
  if (user) {
    console.debug(
      `Failed to create user => Username '${username}'`,
    )
    throw `Username "${username}" is already taken`
  }

  if (!password) {
    console.debug(
      `Failed to create user => Username '${username}'`,
    )
    throw `Password is a required field.`
  }

  // hash the password
  let pwhash: String
  if (password) {
    pwhash = await hash(password.toString(), 10)
  }

  console.log(
    `Successfully created user => Username '${username}'`,
  )

  // insert to db
  const inserted = await db('users')
    .insert({
      id: uuid(),
      username,
      hash: pwhash
    })

  return { message: `Successfully created user => ${username}`}
}

const getById = async (db: Knex, id: String) => {
  return await db('users').select('*').where({ id }).first()
}

// token validator function
export const tokenIsValid = async (db: Knex, token: String) => {
  try {
    // verify jwt token
    const { sub } = verify(token.toString(), SECRET_KEY)
    if (!sub) {
      return false
    } else {
      // check if sub from jwt verification 
      // is associated to a registered
      const user = getById(db, sub.toString())
      if (user != null) {
        return true
      }
      return false
    }
  } catch (ex) {
    return false
  }
}