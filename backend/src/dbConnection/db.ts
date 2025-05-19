import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const connectionString = process.env.POSTGRESQL_URI;
console.log("test",connectionString);


const pool = new Pool({
  connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});


export {pool as db};