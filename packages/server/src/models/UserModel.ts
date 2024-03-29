import client from "./client";
import { v4 as uuidv4 } from "uuid";

import { User } from "../types";

class UserRepository {
  async init() {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);
  }

  async createUser(user: User): Promise<User> {
    const queryResult = await client.query("INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING id", [
      uuidv4(),
      user.email,
      user.password,
    ]);
    return queryResult.rows[0];
  }

    async deleteUserBy(field: string, value: string): Promise<string> {
        const queryResult = await client.query(`DELETE FROM users WHERE ${field} = $1 RETURNING id`, [value]);
        return queryResult.rows[0].id;
    }

  async findUserBy(field: string, value: string): Promise<User | undefined> {
    const queryResult = await client.query(`SELECT * FROM users WHERE ${field} = $1 LIMIT 1`, [value]);
    return queryResult.rows[0] as User | undefined;
  }
}

export default new UserRepository();
