import { Schema, model } from 'mongoose';
import { BanTypes } from '../types/interfaces';

const banSchema: Schema = new Schema({
	RobloxUsername: { type: String },
	RobloxID: { type: Number },
	Moderator: { type: String },
	Reason: { type: String },
	Date: { type: Date, default: Date.now },
	Place: { type: String },
});

export = model<BanTypes>('RobloxBans', banSchema);
