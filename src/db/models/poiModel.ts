import mongoose, { Schema, Document } from 'mongoose';

export interface PointOfInterest extends Document {
  id: string;
  name: string;
  location: string;
  chargingPoints: number;
}

const POISchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  chargingPoints: { type: Number, required: true },
});

export const POIModel = mongoose.model<PointOfInterest>('PointOfInterest', POISchema);
