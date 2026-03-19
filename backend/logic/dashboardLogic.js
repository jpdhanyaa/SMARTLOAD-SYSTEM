const db = require("../database")

function getDashboardData(callback) {
    const query = `
        SELECT
            COALESCE(SUM(items), 0) AS totalItems,
            COUNT(*) AS totalRuns,
            COALESCE(AVG(utilization), 0) AS avgUtil
        FROM optimizations
    `

    db.query(query, (err, rows) => {
        if (err) return callback(err)

        const row = Array.isArray(rows) && rows[0] ? rows[0] : {}

        const totalItems = Number(row.totalItems) || 0
        const totalRuns = Number(row.totalRuns) || 0
        const avgUtilRaw = Number(row.avgUtil) || 0
        const avgUtil = Number(avgUtilRaw.toFixed(1))

        callback(null, { totalItems, totalRuns, avgUtil })
    })
}

module.exports = { getDashboardData }
