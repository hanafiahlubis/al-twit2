import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";

const { Client } = pkg;

const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

});

await client.connect();
console.log("Terhubung ke basis data.");
export default client;