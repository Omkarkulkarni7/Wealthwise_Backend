const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Stock = sequelize.define(
  "Stock",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    company_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "stocks",
    timestamps: false,
  }
);

module.exports = Stock;
