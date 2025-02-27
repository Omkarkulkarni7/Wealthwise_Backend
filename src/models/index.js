const sequelize = require("../configs/db"); // Sequelize instance

// Import models
const User = require("./user.model");
const BankAccount = require("./bankAccount.model");
const Stock = require("./stocks.model");
const Investment = require("./investments.model");
const Transaction = require("./transactions.model");
const Payment = require("./payments.model");

// Define associations

// User & Bank Account
User.hasOne(BankAccount, { foreignKey: "user_id", onDelete: "CASCADE" });
BankAccount.belongsTo(User, { foreignKey: "user_id" });

// User & Investments
User.hasMany(Investment, { foreignKey: "user_id" });
Investment.belongsTo(User, { foreignKey: "user_id" });

// User & Payments
User.hasMany(Payment, { foreignKey: "sender_id" });
Payment.belongsTo(User, { foreignKey: "sender_id" });

// Transactions & Bank Account
Transaction.belongsTo(BankAccount, { foreignKey: "bank_account_id" });


// Investments & Stock
Investment.belongsTo(Stock, { foreignKey: "stock_id" });

// Sync database (without force to avoid data loss)
sequelize
  .sync({ force: false })
  .then(() => console.log("Database & tables synced!"))
  .catch((err) => console.error("Error syncing database:", err));

module.exports = {
  sequelize,
  User,
  BankAccount,
  Stock,
  Investment,
  Transaction,
  Payment,
};
