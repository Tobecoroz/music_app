import pg from 'pg';
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
    database: process.env.DATABASE,
    password: process.env.PASS,
    user: process.env.USER,
    host: process.env.HOST,
    post: process.env.PORT
});

export default pool;