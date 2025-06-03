import pool from "../config/db.js";

const userModel = {
    getAll: async () => {
        const res = await pool.query('SELECT * FROM users');
        return res.rows;
    },
};

export default userModel;