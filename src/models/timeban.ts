import { Schema, model } from 'mongoose';
import { TimebanTypes } from '../types/interfaces';

const timebanSchema: Schema = new Schema({
	RobloxUsername: { type: String },
	RobloxID: { type: Number },
	Moderator: { type: String },
	Reason: { type: String },
	Date: { type: Date, default: Date.now },
	Duration: { type: Number },
});

export = model<TimebanTypes>('RobloxTimebans', timebanSchema);
