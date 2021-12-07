const express = require("express");
const registerRoutes = require("./Routes/Register");
const TonoticeRoutes = require("./Routes/ToNotice");
const AuthenRoutes = require("./Routes/Authen");
require("dotenv").config();

const app = express();
app.use(express.json());

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/firsttask")
  .then(() => {
    console.log("Connected to the database");
  })

  .catch((err) => {
    console.log(err);
  });

app.use("/register", registerRoutes);
app.use("/login", AuthenRoutes);
app.use("/notice", TonoticeRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Listening to the port ${process.env.PORT}`);
});
