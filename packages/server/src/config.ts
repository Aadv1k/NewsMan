import "dotenv/config";

export const JWT_SECRET = "9997191795378971177945460613462218067730";

export const DbConfig = Object.freeze({
    username: process.env.PG_USERNAME,
    host: process.env.PG_HOST,
    db_name: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
})
