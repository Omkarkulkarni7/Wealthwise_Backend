const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const User = require("./user.model");

const BankAccount = sequelize.define(
  "BankAccount",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    account_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "INR",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bank_accounts",
    timestamps: false,
  }
);

// Define associations
User.hasOne(BankAccount, { foreignKey: "user_id" });
BankAccount.belongsTo(User, { foreignKey: "user_id" });

module.exports = BankAccount;
