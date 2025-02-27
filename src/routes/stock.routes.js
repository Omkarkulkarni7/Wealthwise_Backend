const express = require("express");
const StockController = require("../controllers/stock.controller");
const { verifyAccessToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/price/:symbol", verifyAccessToken, StockController.getStockPrice);
router.get("/trending", verifyAccessToken, StockController.getTrendingStocks);
router.get("/search", verifyAccessToken, StockController.searchStocks); 
router.post("/buy", verifyAccessToken, StockController.buyStock);
router.post("/sell", verifyAccessToken, StockController.sellStock);

module.exports = router;
