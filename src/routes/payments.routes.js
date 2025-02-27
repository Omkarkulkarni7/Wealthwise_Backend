const express = require("express");
const PaymentController = require("../controllers/payment.controller");
const { verifyAccessToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/send", verifyAccessToken, PaymentController.sendMoney);

module.exports = router;
