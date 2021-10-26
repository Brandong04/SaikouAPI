import { Document } from 'mongoose';

// --- Ban Schema ---
export interface BanTypes extends Document {
	RobloxUsername: string;
	RobloxID: number;
	Moderator: string;
	Reason: string;
	Place: string;
}

// --- Timeban Schema ---
export interface TimebanTypes extends Document {
	RobloxUsername: string;
	RobloxID: number;
	Moderator: string;
	Reason: string;
	Duration: number;
	Date?: Date;
	Place: string;
}

// --- Error Interface ---
export interface JSONError {
	status?: number;
}
