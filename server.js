const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./config/db");
const cors = require("cors");

//Import routes
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");

//Load middleware
app.use(express.json());
app.use(cors());

//Load routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/profile", profileRoute);

app.listen(process.env.PORT, () => console.log(`Server is running at port: ${process.env.PORT}`));
