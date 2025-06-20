const db = require('../database')

class User {
    static async createUser(user_data){
        const {userName, email, password, firstName, lastName} = user_data;

        const [insertResult] = await db.execute(
            "INSERT INTO users (userName, email, password, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)",
            [userName, email, password, firstName, lastName]
        )
        return insertResult;
    }
    static async findByUsername(user_name){
        // just learned this its array destructuring, how cool!
        const [row] = await db.execute(
            'SELECT id FROM users WHERE userName = ?', 
            [user_name]
        )
        //returns id of user
        return row[0] || null;
    }

    static async findByEmail(email){
        const [row] = await db.execute(
            'SELECT id FROM users WHERE email = ?', 
            [email]
        )
        //returns id of user
        return row[0] || null;
    }

    static async updateRefreshToken(user_id, refresh_token){
        const [result] = await db.execute(
            'UPDATE users SET  refresh_token  = ? WHERE id = ?',
            [refresh_token, user_id]
        )
    }
}


module.exports = User;