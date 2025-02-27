const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const User = require("./user.model");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "payments",
    timestamps: false,
  }
);

// Associations
User.hasMany(Payment, { foreignKey: "sender_id", as: "sentPayments" });
User.hasMany(Payment, { foreignKey: "receiver_id", as: "receivedPayments" });
Payment.belongsTo(User, { foreignKey: "sender_id", as: "sender" });
Payment.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });

module.exports = Payment;
