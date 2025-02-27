const express = require("express");
const router = express.Router();
const bankAccount = require("../controllers/bankAccount.controller");
const { verifyAccessToken } = require("../middleware/auth.middleware");

// Bank Account Routes
router.post("/create", verifyAccessToken, bankAccount.createBankAccount);
router.get("/:userId", verifyAccessToken, bankAccount.getBankAccountByUser);
router.delete("/:userId", verifyAccessToken, bankAccount.deleteBankAccount);

module.exports = router;
