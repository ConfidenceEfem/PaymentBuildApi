const express = require("express")
const port = 2011
const router = require("./routes/Router")
const app = express()
const cors = require("cors")
require("./config/db")

app.use(express.json())
app.use(cors())

app.get("/", (req,res)=>{
    res.send("Transaction API up and running ...!")
    console.log("Transaction API up and running ...!")
})

app.use("/", router)

app.listen(port, ()=>{
    console.log("Listening to port", port)
})