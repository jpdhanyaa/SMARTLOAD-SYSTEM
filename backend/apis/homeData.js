const express = require("express")
const router = express.Router()

const { getDashboardData } = require("../logic/dashboardLogic")

router.get("/home-stats", (req, res) => {
    getDashboardData((err, data) => {
        if (err) {
            console.error("GET /api/home-stats failed:", err.message)
            return res.status(500).json({
                success: false,
                message: "Failed to load dashboard stats"
            })
        }
        res.json({ success: true, data })
    })
})

router.get("/test", (req, res) => {
    res.send("Backend working")
})

module.exports = router