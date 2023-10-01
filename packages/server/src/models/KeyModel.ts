import client from "./client";
import { v4 as uuidv4 } from "uuid";
import { Key } from "../types";

class KeyRepository {
  async init() {
    await client.query(`
      CREATE TABLE IF NOT EXISTS keys (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        key VARCHAR(255) NOT NULL UNIQUE
      )
    `);
  }

  async createKey(key: Key): Promise<Key> {
    const queryResult = await client.query(
      "INSERT INTO keys (user_id, key) VALUES ($1, $2) RETURNING *",
      [key.user_id, key.key]
    );
    return queryResult.rows[0];
  }

  async deleteKeyBy(field: string, value: string): Promise<string> {
    const queryResult = await client.query(`DELETE FROM keys WHERE ${field} = $1 RETURNING id`, [value]);
    return queryResult.rows[0].id;
  }

  async findKeyBy(field: string, value: string): Promise<Key | undefined> {
    const queryResult = await client.query(`SELECT * FROM keys WHERE ${field} = $1 LIMIT 1`, [value]);
    return queryResult.rows[0] as Key | undefined;
  }
}

export default new KeyRepository();
