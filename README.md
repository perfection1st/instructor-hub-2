# Instructor Hub
This project uses the Asana API and requires an auth token.

## Installation:


To start Instructor Hub in a development environment first run `npm install` in both the root and `/api` directory of the project.

Next create your postgres database, copy `database.sql` and `seed.sql` from the /api directory to your docker container using the `docker cp database.sql [container]:database.sql`

Create an .env file in the following format:
```
PG_CONNECT=[Your docker connection string]
COOKIES_SECRET_KEY=[Your asana API token]
TOKEN_SECRET=[Auth API user token]
```

To start in a development environment use `npm start` in the root and `npm run dev` in the `/api` directory.





README Todo:

- Docker compose instructions
