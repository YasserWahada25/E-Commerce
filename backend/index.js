const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')

// Charger les variables d'environnement avec un path explicite
require('dotenv').config({ path: path.join(__dirname, '.env') })

const connectDB = require('./config/db')
const router = require('./routes')


const app = express()
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cookieParser())

app.use("/api",router)
app.use("/uploads", express.static("uploads"));

const PORT = 8080 || process.env.PORT


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT)
    })
})
