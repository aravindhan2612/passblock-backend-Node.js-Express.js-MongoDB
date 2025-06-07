// models/Card.ts
import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CardType } from '../enums/CardType';

export interface ICard extends Document {
  _id: string;
  userId: string;
  cardHolderName: string;
  cardNumberLast: string;
  cardType: CardType;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CardSchema: Schema<ICard> = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    userId: { type: String, ref: 'User', required: true },
    cardHolderName: { type: String, required: true },
    cardNumberLast: { type: String, required: true },
    cardType: {
      type: String,
      enum: Object.values(CardType),
      required: true,
    },
    expiryMonth: { type: Number, required: true, min: 1, max: 12 },
    expiryYear: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICard>('Card', CardSchema);