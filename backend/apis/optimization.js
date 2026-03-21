const express = require("express")
const router = express.Router()
const { runOptimization } = require("../logic/optimizationLogic")

router.post("/run-optimization", (req, res) => {
    runOptimization(req.body, (err, data) => {
        if(err){
            return res.json({success:false})
        }
        res.json({success:true, data})
    })
})

router.get("/latest", (req, res) => {
    const db = require("../database")

    db.query(
        "SELECT * FROM optimization_runs ORDER BY id DESC LIMIT 1",
        (err, result) => {
            if(err){
                return res.json({success:false})
            }
            res.json({success:true, data: result[0]})
        }
    )
})

router.get("/full-result", (req, res) => {

    const db = require("../database")

    db.query(
        "SELECT * FROM optimization_runs ORDER BY id DESC LIMIT 1",
        (err, runResult) => {

            if(err || runResult.length === 0){
                return res.json({success:false})
            }

            const run = runResult[0]

            db.query(
                "SELECT * FROM items WHERE run_id = ?",
                [run.id],
                (err2, itemsResult) => {

                    if(err2){
                        return res.json({success:false})
                    }

                    res.json({
                        success:true,
                        run: run,
                        items: itemsResult
                    })
                }
            )
        }
    )
})

router.get("/items/:id", (req, res) => {
    const db = require("../database")

    db.query(
        "SELECT * FROM items WHERE run_id = ?",
        [req.params.id],
        (err, result) => {
            if(err){
                return res.json({success:false})
            }
            res.json({success:true, data: result})
        }
    )
})

module.exports = router