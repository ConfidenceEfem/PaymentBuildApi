const mongoose = require("mongoose")

const url = "mongodb://localhost/TransactionApi"

mongoose.connect(url).then(()=>{
    console.log("Connected to DB")
}).catch((error)=>{
    console.log(error)
})

module.exports = mongoose