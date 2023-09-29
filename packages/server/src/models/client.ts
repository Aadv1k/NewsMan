import { Client } from "pg";
import { DbConfig } from "../config";

export default new Client({
    user: DbConfig.username,
    host: DbConfig.host,
    database: DbConfig.db_name,
    password: DbConfig.password,
    port: Number(DbConfig.port),
});