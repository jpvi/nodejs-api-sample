import { getUser, getUserRepos } from '../lib/helpers/github';
import { tokenIsValid } from '../lib/helpers/users'
import { TemporaryUserStore, TemporaryUser } from '../lib/redis/TemporaryUserStore';
import { HookContext } from '../types'

export const hook = async ({ server, db, redis }: HookContext): Promise<void> => {
    const userRequestLimit = 10

    server.post('/api/github/users', async (req, res) => {

        // check if token exists
        const token = req.headers.authorization?.replace("Bearer ", "").trim()
        if (!token) {
            // if it doesn't return a 400
            // and an error message
            console.debug(
                `Request failed => token was not found.`,
            )
            return res.status(400).send({ message: "Auth token required." })
        }

        // validate token
        if (!await tokenIsValid(db, token)) {
            console.debug(
                `Request failed => token was not valid.`,
            )
            return res.status(400).send({ message: "Auth token is not valid." })
        }

        // get user list from req body
        const users: string[] = req.body.users
        if (!users || users.length == 0) {
            console.debug(
                `Request failed => users parameter not found or incomplete.`,
            )
            return res.status(400).send({ message: "Users parameter required." })
        }

        // check if user list exceeds 10
        if (users.length > userRequestLimit) {
            console.debug(
                `Request failed => users parameter exceeds the limit. (Limit: ${userRequestLimit})`,
            )
            return res.status(400).send({ message: `Users parameter exceeds the limit. (Limit: ${userRequestLimit})` })
        }

        // iterate each user
        let returnUsers = new Array()
        for (var i in users) {
            const username = users[i]

            // check first in redis
            const user: TemporaryUser = await TemporaryUserStore.get(redis, username)

            // if user is in redis, push to return array
            if (user != undefined && user != null) {
                returnUsers.push(user)
            } else {
                try {
                    // get github user
                    const ghUser = JSON.parse(await getUser(username))

                    if (ghUser != undefined && ghUser != null) {

                        // get github user repos
                        const ghRepos = JSON.parse(await getUserRepos(username))

                        let average_repo_followers = 0
                        if (ghRepos != undefined && ghRepos != null) {
                            // compute for repo watchers
                            let total_repo_followers = 0
                            ghRepos.forEach(r => {
                                total_repo_followers += r.watchers
                            });
                            average_repo_followers = Number(total_repo_followers / ghRepos.length)
                        }

                        // form user
                        const newUser: TemporaryUser = {
                            login: ghUser.login,
                            name: ghUser.name,
                            company: ghUser.company,
                            followers: ghUser.followers,
                            public_repos: ghUser.public_repos,
                            average_repo_followers
                        }
                        // store the newly formed user
                        await TemporaryUserStore.set(redis, newUser)

                        returnUsers.push(newUser)
                    }
                } catch (ex) {
                    console.debug(`Get GitHub user => ${username} : ${ex}`)
                } finally {
                    continue
                }
            }
        }

        // return gathered users as result
        return res.send(returnUsers)

    })

}

export default { hook }
