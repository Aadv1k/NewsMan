import { User } from "../controllers/user";
import client from "./client";

import { v4 as uuidv4 } from "uuid";

export default class {
    async init() {
        client.query(`CREATE TABLE IF NOT EXISTS users (
                user_id UUID PRIMARY KEY DEFAULT uuidv4()
                email VARCHAR(255) NOT NULL UNIQUE,
                password STRING NOT NULL
            )
        `)
    }


    async createUser(user: User): Promise<string> {
        const queryResult =  await client.query("INSERT INTO users (id = $1, email = $2, password = $3) RETURNING id", [uuidv4(), user.email, user.password]);
        return queryResult.rows[0].id;
    }

    async deleteUserBy(field: string, value: string): Promise<string> {
        const queryResult = await client.query(`DELETE FROM users WHERE ${field} = $1 RETURNING id`, [value]);
        return queryResult.rows[0].id;
    }

    async getUserBy(field: string, value: string): Promise<User> {
        const queryResult = await client.query(`SELECT FROM users WHERE ${field} = $1 LIMIT 1`, [value]);
        return queryResult.rows[0] as User;
    }

}