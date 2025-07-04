import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();
console.log("Terhubung ke basis data.");
export default client;
