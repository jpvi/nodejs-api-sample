# API Sample

## Dependencies

- NPM
- MySQL
- Redis

## Installation

1. Install and run the dependencies listed above
2. Create a mysql db
3. Setup your `.env` (see below)
4. Install deps: `npm install`
5. Start running the server: `npm run dev`

## .env

```
DEPLOYMENT=dev

# Postgres
MYSQL_DATABASE=[your local database - probably something like "api-sample"]
MYSQL_USER=[your local mysql user]
MYSQL_PASSWORD=[your local mysql password]
MYSQL_HOST=localhost
MYSQL_PORT=3306

# Redis
REDIS_URI=redis://localhost:6379

# JWT Secret Key :
SECRET_KEY=[secret key to sign and verify tokens, this can be anything]
```


# How to use the endpoints

(You may use the postman collection included in the solution - `API Sample.postman_collection.json`)

## Registration (Postman - Users/Register)

1. Register a user by sending a post request to `/api/users/register`. Required body:

```
{
    username: <your desired username>,
    password: <your desired password>
}
```

2. You should receive a message indicating that you have successfully created the user.

## Authentication (Postman - Users/Authenticate)

1. Using your registered user, send a post request to `/api/users/authenticate/`. Required body

```
{
    username: <your registered username>,
    password: <your registered password>
}
```

2. You should receive a 200 containing a JSON response that contains your id, username and token.

```
example:
{
    "id": "56f711bc-a1c9-4360-af8a-9daac48c4e05",
    "username": "jpibanez",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NmY3MTFiYy1hMWM5LTQzNjAtYWY4YS05ZGFhYzQ4YzRlMDUiLCJpYXQiOjE2NDYyMDkxMDUsImV4cCI6MTY0NjI5NTUwNX0.Qk6rs4U6VnvJiS-SW67JC5g8ph76YSkuxPSsDuM2CVA"
}
```

3. Copy or take note of the token as you will be using it for the GitHub request below.

## Get github users (Postman - Get Github Users)

1. Send a post request to `/api/github/users`. Required body sample:

```
{
    "users": [
        "jpvi",
        "test",
        "test1",
        "test2",
        "test3"
    ]
}
```

2. On the headers, Add an `Authorization` key with a value of `Bearer <token>`. Replace `<token>` with  the token you copied from above (Authentication).
3. You should get a json array response containing the details of each github user.
