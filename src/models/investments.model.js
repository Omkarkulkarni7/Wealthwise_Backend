const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const User = require("./user.model");
const Stock = require("./stocks.model");

const Investment = sequelize.define(
  "Investment",
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
    stock_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Stock,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchase_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "investments",
    timestamps: false,
  }
);

// Associations
User.hasMany(Investment, { foreignKey: "user_id" });
Investment.belongsTo(User, { foreignKey: "user_id" });

Stock.hasMany(Investment, { foreignKey: "stock_id" });
Investment.belongsTo(Stock, { foreignKey: "stock_id" });

module.exports = Investment;
