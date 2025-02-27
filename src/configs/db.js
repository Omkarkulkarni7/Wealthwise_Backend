// const { Sequelize } = require("sequelize");
// const dotenv = require("dotenv");

// dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//     logging: false, // Set to true if you want SQL logs
//   }
// );

// // Test PostgreSQL connection
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connected to PostgreSQL database using Sequelize.");
//   } catch (error) {
//     console.error("Database connection error:", error);
//     process.exit(1);
//   }
// })();

// module.exports = sequelize;


const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // Set to true if you want SQL logs
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Render-hosted PostgreSQL
    },
  },
});

// Test PostgreSQL connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL database using Sequelize.");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
})();

module.exports = sequelize;

