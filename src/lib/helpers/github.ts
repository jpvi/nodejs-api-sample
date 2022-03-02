import { Knex } from 'knex'
import { compare, hash } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { SECRET_KEY } from '../../conf'
import { uuid } from 'uuidv4'
import { Redis } from 'ioredis'
import request from 'request-promise'

export const getUser = async (
    username: string
) => {
    // get users from github api
    const users = await sendRequest('GET', `https://api.github.com/users/${username}`)
    console.log(
        `Getting user from github => Username '${username}'`
    )
    return users
}

export const getUserRepos = async (
    username: string
) => {
    // get user specific repos from github api
    const userRepos = await sendRequest('GET', `https://api.github.com/users/${username}/repos`)
    console.log(
        `Getting user repos from github => Username '${username}'`
    )
    return userRepos
}

const sendRequest = async (method: "GET" | "POST", url: String) => {
    var options = {
        'method': method,
        'url': url.toString(),
        'headers': {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'API-Sample'
        }
    }
    return await request(options, function (err, res) {
        if (err)
            throw err
    })
}
