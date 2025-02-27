const yahooFinance = require("yahoo-finance2").default;
const { Investment, Stock, User } = require("../models");

class InvestmentController {
  // Get all investments of a user
  static async getUserInvestments(req, res) {
    try {
      const { user_id } = req.params;

      // Fetch investments with stock details
      const investments = await Investment.findAll({
        where: { user_id },
        include: [{ model: Stock, attributes: ["symbol", "company_name"] }],
      });

      if (!investments.length) {
        return res.status(404).json({ message: "No investments found" });
      }

      // Fetch live prices from Yahoo Finance
      const stockSymbols = investments.map((inv) => inv.Stock.symbol);
      const stockPrices = await yahooFinance.quote(stockSymbols);

      // Construct response with profit/loss calculation
      const investmentData = investments.map((inv) => {
        const livePrice = stockPrices[inv.Stock.symbol]?.regularMarketPrice || inv.purchase_price;
        const totalInvestment = inv.quantity * inv.purchase_price;
        const currentValue = inv.quantity * livePrice;
        const profitLoss = currentValue - totalInvestment;

        return {
          stock_symbol: inv.Stock.symbol,
          company_name: inv.Stock.company_name,
          quantity: inv.quantity,
          purchase_price: inv.purchase_price,
          current_price: livePrice,
          profit_loss: profitLoss,
        };
      });

      res.json({ investments: investmentData });
    } catch (error) {
      console.error("Error fetching investments:", error.message);
      res.status(500).json({ error: "Failed to retrieve investments" });
    }
  }
}

module.exports = InvestmentController;
