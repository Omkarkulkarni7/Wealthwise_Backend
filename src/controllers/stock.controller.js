const yahooFinance = require("yahoo-finance2").default;
const { Investment, Stock, BankAccount, User } = require("../models");
const { Op } = require("sequelize");


class StockController {
  // Fetch real-time stock price
  static async getStockPrice(req, res) {
    try {
      const { symbol } = req.params;
      const result = await yahooFinance.quote(symbol);
      
      res.json({
        symbol: result.symbol,
        company_name: result.shortName,
        price: result.regularMarketPrice,
        currency: result.currency,
        last_updated: result.regularMarketTime,
      });
    } catch (error) {
      console.error("Error fetching stock price:", error.message);
      res.status(500).json({ error: "Stock data fetch failed." });
    }
  }

  // Fetch top 50 trending stocks dynamically
  static async getTrendingStocks(req, res) {
    const queryOptions = { count: 5, lang: 'en-US' };  // top 5 trending stocks
    try {
      const result = await yahooFinance.trendingSymbols('IN', queryOptions);  // 'IN' for India
      const trendingStocks = await Promise.all(
        result.quotes.map(async (stock) => {
          const quote = await yahooFinance.quote(stock.symbol);  // Get detailed info for each stock
          return {
            symbol: stock.symbol,
            companyName: quote.longName || quote.shortName,  // Use longName or shortName
            price: quote.regularMarketPrice,  // Latest market price
          };
        })
      );
      res.json(trendingStocks);  // Send the trending stocks as a JSON response
    } catch (error) {
      console.error('Error fetching trending stocks:', error);
      res.status(500).json({ error: 'Could not fetch trending stocks' });
    }
  }


  // Autocomplete Search - Fetch stock symbols dynamically
  static async searchStocks(req, res) {
    try {
      const { query } = req.query; // Get user input from query params
      if (!query) return res.json([]);

      const results = await yahooFinance.search(query);
      const suggestions = results.quotes.slice(0, 10).map((s) => ({
        symbol: s.symbol,
        company_name: s.shortname,
      }));

      res.json(suggestions);
    } catch (error) {
      console.error("Error searching stocks:", error.message);
      res.status(500).json({ error: "Stock search failed." });
    }
  }


   // Buy Stock API
   static async buyStock(req, res) {
    try {
      const { user_id, symbol, quantity } = req.body;

      // Fetch stock details from Yahoo Finance
      const stockData = await yahooFinance.quote(symbol);
      if (!stockData) return res.status(404).json({ error: "Stock not found" });

      const stockPrice = stockData.regularMarketPrice;
      const totalCost = stockPrice * quantity;

      // Fetch user's bank account
      const bankAccount = await BankAccount.findOne({ where: { user_id } });
      if (!bankAccount) return res.status(400).json({ error: "Bank account not found" });

      // Check if user has enough balance
      if (bankAccount.balance < totalCost) {
        return res.status(400).json({ error: "Insufficient funds" });
      }

      // Deduct amount from bank account
      bankAccount.balance -= totalCost;
      await bankAccount.save();

      // Store investment
      let stock = await Stock.findOne({ where: { symbol } });
      if (!stock) {
        stock = await Stock.create({
          symbol,
          company_name: stockData.shortName,
          price: stockPrice,
          last_updated: new Date(),
        });
      }

      await Investment.create({
        user_id,
        stock_id: stock.id,
        quantity,
        purchase_price: stockPrice,
      });

      res.json({ message: "Stock purchased successfully", stockPrice });
    } catch (error) {
      console.error("Error buying stock:", error.message);
      res.status(500).json({ error: "Stock purchase failed." });
    }
  }

  // Sell Stock API
  static async sellStock(req, res) {
    try {
      const { user_id, symbol, quantity } = req.body;

      // Find the stock
      const stock = await Stock.findOne({ where: { symbol } });
      if (!stock) return res.status(404).json({ error: "Stock not found" });

      // Find user's investment
      const investment = await Investment.findOne({
        where: { user_id, stock_id: stock.id },
      });

      if (!investment || investment.quantity < quantity) {
        return res.status(400).json({ error: "Not enough stocks to sell" });
      }

      // Fetch latest stock price
      const stockData = await yahooFinance.quote(symbol);
      const sellingPrice = parseFloat(stockData.regularMarketPrice).toFixed(2);
      const totalEarnings = (parseFloat(sellingPrice) * quantity).toFixed(2);

      // Update investment quantity
      if (investment.quantity === quantity) {
        await investment.destroy(); // Sell all, remove record
      } else {
        investment.quantity -= quantity;
        await investment.save();
      }

      // Credit amount to user's bank account
      const bankAccount = await BankAccount.findOne({ where: { user_id } });
      bankAccount.balance = (parseFloat(bankAccount.balance) + parseFloat(totalEarnings)).toFixed(2);
      await bankAccount.save();

      res.json({ message: "Stock sold successfully", sellingPrice });
    } catch (error) {
      console.error("Error selling stock:", error.message);
      res.status(500).json({ error: "Stock sale failed." });
    }
  }
}

module.exports = StockController;
