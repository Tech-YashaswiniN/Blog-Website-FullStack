// db.js
const mongoose = require("mongoose");

const dbUrl = process.env.ATLASDB_URL || 'your-default-local-db-url';

async function connectDB() {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connection successful");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

module.exports = connectDB;
