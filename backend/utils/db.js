import mongoose from "mongoose"

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected successfully') // Log success message
    } 
    catch (error) {
        console.log(error) // Log any connection errors
    }
}

export default connectDB // Export the function for use in other files
