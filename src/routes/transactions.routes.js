const express = require("express");
const TransactionController = require("../controllers/transaction.controller");
const { verifyAccessToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.put("/deposit", verifyAccessToken, TransactionController.deposit);
router.put("/withdraw", verifyAccessToken, TransactionController.withdraw);

module.exports = router;
