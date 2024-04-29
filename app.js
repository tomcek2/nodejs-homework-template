const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");
const authenticateToken = require("./middleware/authenticateToken");
const path = require("path");

const app = express();

connectDB();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use("/api/protectedRoute", authenticateToken);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
