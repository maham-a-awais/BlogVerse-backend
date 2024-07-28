const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes"); //ADD USER ROUTES
const { PORT } = require("./config/.localEnv");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.use("/api/users", userRoutes);

app.listen(PORT, (err, res) => {
  console.log(`Server is listening on port: ${PORT}`);
});
