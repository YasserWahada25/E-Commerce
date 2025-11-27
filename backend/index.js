const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')

// Charger les variables d'environnement avec un path explicite
require('dotenv').config({ path: path.join(__dirname, '.env') })

const connectDB = require('./config/db')
const router = require('./routes')


const app = express()
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "https://monumental-seahorse-2a09c2.netlify.app",
    "https://e-commerce-3ilu.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cookieParser())

app.use("/api", router)
app.use("/uploads", express.static("uploads"));

const PORT = 8080 || process.env.PORT


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("connnect to DB")
        console.log("Server is running " + PORT)
    })
})
