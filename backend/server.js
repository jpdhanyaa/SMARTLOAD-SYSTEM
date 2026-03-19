const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
const port = Number.isFinite(Number.parseInt(process.env.PORT, 10))
    ? Number.parseInt(process.env.PORT, 10)
    : 3000

app.use(cors())
app.use(express.json())

const homeData = require("./apis/homeData")

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

app.post("/api/run-optimization", (req, res) => {

    const items = req.body.items

    let totalItems = items.length

    let totalVolume = 100
    let usedVolume = 0

    for(let i = 0; i < items.length; i++){
        const item = items[i]
        const vol = item.width * item.height * item.depth
        usedVolume += vol
    }

    let avgUtil = (usedVolume / totalVolume) * 100
    avgUtil = avgUtil.toFixed(1)

    let totalRuns = Math.floor(Math.random() * 10) + 1

    res.json({
        success: true,
        data: {
            totalItems,
            totalRuns,
            avgUtil
        }
    })
})