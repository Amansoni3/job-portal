import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from 'dotenv'
import connectDB from "./utils/db.js"

// Load environment variables from .env file
dotenv.config({})

const app = express()

// Middleware setup
app.use(express.json()) // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded request bodies
app.use(cookieParser()) // Enable cookie parsing

// CORS configuration
const corsOptions = {
    origin: process.env.ORIGIN, // Allowed frontend origin (note: missing ':' in 'http//')
    credentials: true // Allow cookies to be sent with requests
}

app.use(cors(corsOptions)) // Enable CORS with specified options

// Define the server port from environment variables or use default 3000
const PORT = process.env.PORT || 3000

// Start the server
app.listen(PORT, () => {
    connectDB() // Connect to the database
    console.log(`Server running at port ${PORT}`) // Log server startup message
})
