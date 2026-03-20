const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
const port = Number.isFinite(Number.parseInt(process.env.PORT, 10))
    ? Number.parseInt(process.env.PORT, 10)
    : 3000

app.use(cors())
app.use(express.json())

const db = require("./database")
const homeData = require("./apis/homeData")

app.get("/api/optimizations", (req, res) => {
    db.query("SELECT * FROM optimization_runs ORDER BY id DESC", (err, result) => {
        if(err){
            return res.json({success:false})
        }
        res.json({
            success:true,
            data: result
        })
    })
})

app.post("/api/run-optimization", (req, res) => {

    const containerType = req.body.containerType
    const items = req.body.items
    const containerVolume = req.body.containerVolume || 1000000

    if (!items || items.length === 0) {
        return res.json({ success: false, message: "No items provided" })
    }

    let totalItems = items.length
    let totalWeight = 0
    let usedVolume = 0

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const volume = item.length * item.width * item.height
        usedVolume += volume
        totalWeight += item.weight
    }

    let utilization = (usedVolume / containerVolume) * 100
    if (utilization > 100) utilization = 100

    utilization = utilization.toFixed(1)

    db.query(
        "INSERT INTO optimization_runs (container_type, total_items, total_weight, utilization) VALUES (?, ?, ?, ?)",
        [containerType, totalItems, totalWeight, utilization],
        (err) => {
            if (err) {
                return res.json({ success: false })
            }

            res.json({
                success: true,
                data: {
                    containerType,
                    totalItems,
                    totalWeight,
                    utilization
                }
            })
        }
    )
})

app.use("/api", homeData)

const frontendDir = path.join(__dirname, "..", "frontend")
app.use(express.static(frontendDir))

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDir, "home.html"))
})

app.use((req, res) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ success: false, message: "Not found" })
    }
    res.status(404).sendFile(path.join(frontendDir, "not.html"))
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    console.log(`Open http://localhost:${port}/`)
})