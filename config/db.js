const mongoose = require("mongoose");

mongoose.connect(
  process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false },
  () => console.log("Connected to database.")
);
