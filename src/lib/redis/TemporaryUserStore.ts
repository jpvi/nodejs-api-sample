import { Redis } from 'ioredis'
import { isNil } from 'ramda'

export type TemporaryUser = {
    login: string,
    name: string,
    company: string,
    followers: number,
    public_repos: number,
    average_repo_followers: number
}

const key = username => `api-sample:users:${username}`

export class TemporaryUserStore {
    static async get(redis: Redis, username: string) {
        const value = await redis.get(key(username))

        if (isNil(value)) {
            console.debug(
                `${TemporaryUserStore.name} => did not find user '${username}'`
            )
        } else {
            const user = JSON.parse(value) as TemporaryUser
            console.log(
                `${TemporaryUserStore.name} => found user '${username}'`,
                user
            )
            return user
        }
    }

    static async set(
        redis: Redis,
        user: TemporaryUser,
        expires = 2 * 60
    ) {

        const storeUser: TemporaryUser = user

        await redis.set(key(user.login), JSON.stringify(storeUser), 'EX', expires)

        console.debug(
            `${TemporaryUserStore.name} => set user '${user.login}'`,
            storeUser
        )

        return storeUser
    }
}
