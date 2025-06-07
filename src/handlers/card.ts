import { Request, Response } from 'express';
import Card from '../models/Card';


export async function addCard(req: Request, res: Response) {
    try {
        const userId = req?.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: User ID not found' });
            return;
        }

        const { cardHolderName, cardNumberLast, cardType, expiryMonth, expiryYear, isDefault } = req.body;
        const existingCard = await Card.findOne({ cardNumberLast, userId });
        if (existingCard) {
            res.status(400).json({ error: 'Card already exists' });
            return;
        }

        const newCard = new Card({
            userId: userId,
            cardHolderName,
            cardNumberLast,
            cardType,
            expiryMonth,
            expiryYear,
            isDefault,
        });

        if (isDefault) {
            // Set all other cards to not default
            await Card.updateMany({ userId: userId }, { isDefault: false });
        }

        const savedCard = await newCard.save();
        res.status(201).json(savedCard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add card.' });
    }
}

export async function updateCard(req: Request, res: Response) {
    try {
        const userId = req?.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: User ID not found' });
            return;
        }
        const { id } = req.params;

        const updatedData = { ...req.body };

        if (updatedData.isDefault) {
            await Card.updateMany({ userId: userId }, { isDefault: false });
        }

        const card = await Card.findOneAndUpdate(
            { _id: id, userId: userId },
            updatedData,
            { new: true }
        );

        if (!card) {
            res.status(404).json({ error: 'Card not found.' });
            return
        }

        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update card.' });
    }
}

export async function getCards(req: Request, res: Response) {
    try {
        const userId = req?.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: User ID not found' });
            return;
        }
        const cards = await Card.find({ userId: userId }).sort({ createdAt: -1 });
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve cards.' });
    }
}