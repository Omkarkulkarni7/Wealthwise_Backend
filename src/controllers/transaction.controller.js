const { Transaction, BankAccount } = require("../models");
const sequelize = require("../configs/db");

exports.deposit = async (req, res) => {
    const { bankAccountId, amount } = req.body;

    if (!bankAccountId || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid deposit amount" });
    }

    const transaction = await sequelize.transaction();
    try {
        const bankAccount = await BankAccount.findByPk(bankAccountId, { transaction });
        if (!bankAccount) {
            await transaction.rollback();
            return res.status(404).json({ message: "Bank account not found" });
        }

        //console.log("Before deposit:", bankAccount.balance);

        // Ensure precision using toFixed(2)
        const newBalance = (parseFloat(bankAccount.balance) + parseFloat(amount)).toFixed(2);
        bankAccount.balance = newBalance;

        //console.log("After deposit:", bankAccount.balance);

        await bankAccount.save({ transaction });

        // Create transaction record
        await Transaction.create(
            { bank_account_id: bankAccountId, amount, transaction_type: "deposit", status: "completed" },
            { transaction }
        );

        await transaction.commit();
        return res.status(200).json({ message: "Deposit successful", newBalance });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.withdraw = async (req, res) => {
    const { bankAccountId, amount } = req.body;

    if (!bankAccountId || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid withdrawal amount" });
    }

    const transaction = await sequelize.transaction();
    try {
        const bankAccount = await BankAccount.findByPk(bankAccountId, { transaction });
        if (!bankAccount) {
            await transaction.rollback();
            return res.status(404).json({ message: "Bank account not found" });
        }

        if (parseFloat(bankAccount.balance) < parseFloat(amount)) {
            await transaction.rollback();
            return res.status(400).json({ message: "Insufficient funds" });
        }

        //console.log("Before withdrawal:", bankAccount.balance);

        // Ensure precision using toFixed(2)
        const newBalance = (parseFloat(bankAccount.balance) - parseFloat(amount)).toFixed(2);
        bankAccount.balance = newBalance;

        //console.log("After withdrawal:", bankAccount.balance);

        await bankAccount.save({ transaction });

        // Create transaction record
        await Transaction.create(
            { bank_account_id: bankAccountId, amount, transaction_type: "withdraw", status: "completed" },
            { transaction }
        );

        await transaction.commit();
        return res.status(200).json({ message: "Withdrawal successful", newBalance });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
