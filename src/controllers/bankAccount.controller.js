const { BankAccount, User } = require("../models");

// Function to generate a unique 11-digit account number
const generateUniqueAccountNumber = async () => {
  let accountNumber;
  let isUnique = false;

  while (!isUnique) {
    accountNumber = Math.floor(10000000000 + Math.random() * 90000000000).toString();
    const existingAccount = await BankAccount.findOne({ where: { account_number: accountNumber } });
    if (!existingAccount) {
      isUnique = true;
    }
  }

  return accountNumber;
};

exports.createBankAccount = async (req, res) => {
  try {
    const { user_id, balance, currency } = req.body;

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if user already has a bank account
    const existingAccount = await BankAccount.findOne({ where: { user_id } });
    if (existingAccount) return res.status(400).json({ message: "User already has a bank account" });

    // Generate a unique account number
    const account_number = await generateUniqueAccountNumber();

    // Create bank account
    const newAccount = await BankAccount.create({
      user_id,
      account_number,
      balance: balance || 0.00,
      currency: currency || "INR",
    });

    res.status(201).json({ message: "Bank account created successfully", account: newAccount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get Bank Account by User ID (Since one user has only one account)
exports.getBankAccountByUser = async (req, res) => {
  try {
    const account = await BankAccount.findOne({ where: { user_id: req.params.userId } });
    if (!account) return res.status(404).json({ message: "Bank account not found" });

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Bank Account (Only if required)
exports.deleteBankAccount = async (req, res) => {
  try {
    const { userId } = req.params;

    const account = await BankAccount.findOne({ where: { user_id: userId } });
    if (!account) return res.status(404).json({ message: "Bank account not found" });

    await account.destroy();

    res.status(200).json({ message: "Bank account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
