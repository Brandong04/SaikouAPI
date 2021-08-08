import { Document } from 'mongoose';

// --- Ban Schema ---
export interface BanTypes extends Document {
	RobloxUsername: string;
	RobloxID: number;
	Moderator: string;
	Reason: string;
}

// --- Timeban Schema ---
export interface TimebanTypes extends Document {
	RobloxUsername: string;
	RobloxID: number;
	Moderator: string;
	Reason: string;
	Duration: number;
	Date?: Date;
}
