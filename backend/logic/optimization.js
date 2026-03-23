const db = require("../database")

function runOptimization(body, callback){

    const items = body.items
    const containerType = body.containerType
    const container = body.container
    const containerVolume = container.length * container.width * container.height

    if(!items || items.length === 0){
        return callback(true)
    }

    let totalItems = items.length
    let totalWeight = 0
    let usedVolume = 0

    for(let i=0;i<items.length;i++){
        const item = items[i]

        const vol = item.length * item.width * item.height
        usedVolume += vol
        totalWeight += item.weight
    }

    let utilization = (usedVolume / containerVolume) * 100
    if(utilization > 90) utilization = 90
    utilization = utilization.toFixed(1)

    db.query(
        "INSERT INTO optimization_runs (container_type,total_items,total_weight,utilization) VALUES (?,?,?,?)",
        [containerType,totalItems,totalWeight,utilization],
        (err,result)=>{
            if(err){
                return callback(true)
            }

            const runId = result.insertId

            for(let i=0;i<items.length;i++){
                const item = items[i]

                db.query(
                    "INSERT INTO items (run_id,name,length,width,height,weight,fragile) VALUES (?,?,?,?,?,?,?)",
                    [
                        runId,
                        item.name,
                        item.length,
                        item.width,
                        item.height,
                        item.weight,
                        item.fragile || false
                    ]
                )
            }

            callback(null,{
                runId,
                totalItems,
                totalWeight,
                utilization
            })
        }
    )
}

module.exports = { runOptimization }