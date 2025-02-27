const { Payment, BankAccount, User } = require("../models");
const sequelize = require("../configs/db");

exports.sendMoney = async (req, res) => {
    const { senderId, receiverId, amount } = req.body;

    if (!senderId || !receiverId || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid input parameters" });
    }

    const transaction = await sequelize.transaction();

    try {
        // Fetch sender and receiver bank accounts
        const senderAccount = await BankAccount.findOne({ where: { user_id: senderId }, transaction });
        const receiverAccount = await BankAccount.findOne({ where: { user_id: receiverId }, transaction });

        if (!senderAccount || !receiverAccount) {
            await transaction.rollback();
            return res.status(404).json({ message: "Sender or receiver account not found" });
        }

        // Check sender's balance
        if (senderAccount.balance < amount) {
            await transaction.rollback();
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Convert balance to a number before arithmetic
        const senderBalance = parseFloat(senderAccount.balance);
        const receiverBalance = parseFloat(receiverAccount.balance);
        const transferAmount = parseFloat(amount);

        // Deduct from sender, add to receiver
        senderAccount.balance = (senderBalance - transferAmount).toFixed(2);
        receiverAccount.balance = (receiverBalance + transferAmount).toFixed(2);


        await senderAccount.save({ transaction });
        await receiverAccount.save({ transaction });

        // Create payment record
        await Payment.create(
            { sender_id: senderId, receiver_id: receiverId, amount, payment_status: "completed" },
            { transaction }
        );

        await transaction.commit();
        return res.status(200).json({ message: "Payment successful" });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
