// Initialize dotenv (dev environment)
require('dotenv').config();

// Initialize Express
const express = require('express');
const app = express();

// Initialize Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json);

// Serve static assets when deplyoed to heroku
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// Routes
// app.use(routes);
// app.use("/api/user", require('./routes/user'));

// Intialize Mongoose
const mongoose = require('mongoose');
let db = process.env.MONGODB_URI || process.env.DB_LOCALHOST;

// Connect to MongoDB
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Server PORT
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, function () {
    console.log("Server is running on http://localhost:" + PORT);
})