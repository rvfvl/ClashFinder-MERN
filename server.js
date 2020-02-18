const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

//Import routes
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("Connected to database.");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectToDb();

//Load middleware
app.use(express.json());
app.use(cors());

//Load routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/profile", profileRoute);

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.listen(process.env.PORT, () => console.log(`Server is running at port: ${process.env.PORT}`));
