const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./src/models"); // Import Sequelize instance
const sequelize = require("./src/db"); // Correct import for Sequelize


// Import routes
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const adminRoutes = require("./src/routes/admin.routes");
const bankAccountRoutes = require("./src/routes/bankAccount.routes");
const transactionRoutes = require("./src/routes/transactions.routes");
const paymentRoutes = require("./src/routes/payments.routes");
const stockRoutes = require("./src/routes/stock.routes");
const investmentRoutes = require("./src/routes/investment.routes")

const app = express();

// Middleware
app.use(express.json());
// In backend/server.js
app.use(
  cors({
      origin: "http://localhost:3000", // ✅ Allow frontend origin
      credentials: true, // ✅ Allow cookies & authentication headers
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // ✅ Allow all request methods
      allowedHeaders: "Content-Type,Authorization", // ✅ Allow headers
  })
);

// Server setup
app.listen(5000, () => console.log("Server running on port 5000"));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the WealthWise project!");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bank-accounts", bankAccountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stocks", stockRoutes)
app.use("/api/investments", investmentRoutes)


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

module.exports = app;
