import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });


const connectionString = process.env.POSTGRESQL_URI;
console.log("test",connectionString);


const pool = new Pool({
  connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});


pool.connect()
.then(() => {
  console.log("Connected to PostgreSQL database");
})
.catch((err) => {
  console.error("Error connecting to PostgreSQL database", err);
});

export {pool as db};