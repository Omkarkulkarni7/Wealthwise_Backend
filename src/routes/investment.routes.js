const express = require("express");
const InvestmentController = require("../controllers/investment.contoller");

const router = express.Router();

router.get("/:user_id", InvestmentController.getUserInvestments);

module.exports = router;
