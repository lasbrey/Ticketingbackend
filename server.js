const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const {logger} = require("./middleware/logEvents");
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;

// Load env variables
dotenv.config({ path: "./config/.env" });

// Connect to database
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
// app.use(cors());
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, "public")));

// Define Routes
app.use("/", require("./routes/routes"));

app.all("*", (req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.use(errorHandler);

//Configure Port
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});