const mysql = require("mysql2")

const dbPort = Number.parseInt(process.env.DB_PORT, 10)
const dbPoolLimit = Number.parseInt(process.env.DB_POOL_LIMIT, 10)

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: Number.isFinite(dbPort) ? dbPort : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "dhanyaa@2006",
    database: process.env.DB_NAME || "smartload"
}

const db = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: Number.isFinite(dbPoolLimit) ? dbPoolLimit : 10,
    queueLimit: 0
})

db.getConnection((err, conn) => {
    if (err) {
        console.error("Database connection error:", err.message)
        return
    }
    console.log("Database connected")
    conn.release()
})

module.exports = db
