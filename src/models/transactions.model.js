const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const BankAccount = require("./bankAccount.model");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bank_account_id: {
      type: DataTypes.INTEGER,
      references: {
        model: BankAccount,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.ENUM("deposit", "withdraw"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "transactions",
    timestamps: false,
  }
);

// Associations
BankAccount.hasMany(Transaction, { foreignKey: "bank_account_id" });
Transaction.belongsTo(BankAccount, { foreignKey: "bank_account_id" });

module.exports = Transaction;
