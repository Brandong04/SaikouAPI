import express, { Router } from 'express';

import PermBan from '../models/ban';
import TimeBan from '../models/timeban';

const router: Router = express.Router();

/* 
TITLE: Endpoint For Checking Bans
URL: http://localhost/v1/users/{userID}/banned
HEADERS: X-API-KEY
*/

export const checkBan = router.get('/users/:userid/banned', async (request, response) => {
	const { userid } = request.params;

	if (Number.isNaN(Number(userid))) {
		return response.status(400).json({ errorCode: 1, message: 'Roblox ID contains alphabetic characters.' });
	}

	/* Checking if they have a permanent ban */
	const permbanPlayer = await PermBan.findOne({ RobloxID: Number(userid) }, '-__v -_id');

	if (permbanPlayer) {
		return response.json({ banned: true, type: 'permban', player: permbanPlayer });
	}

	/* Checking if they have a temporary ban */
	const timebanPlayer = await TimeBan.findOne({ RobloxID: Number(userid) }, '-__v -_id');

	if (timebanPlayer) {
		return response.json({ banned: true, type: 'timeban', player: timebanPlayer });
	}

	/* If user doesn't have either a temp or perm ban, return false */
	return response.json({ banned: false });
});

/* 
TITLE: Endpoint For Adding Perm Bans
URL: http://localhost/v1/bans/create-new
HEADERS: X-API-KEY
*/

export const addPermBan = router.post('/bans/create-new', async (request, response) => {
	const { RobloxUsername, RobloxID, Moderator, Reason } = request.body;

	if (!RobloxUsername || !RobloxID || !Moderator || !Reason) {
		return response.status(400).json({ errorCode: 6, message: 'Some required fields were missing.' });
	}

	if (typeof RobloxUsername !== 'string' || typeof RobloxID !== 'number' || typeof Moderator !== 'string' || typeof Reason !== 'string') {
		return response.status(400).json({ errorCode: 7, message: 'Inputted values lacked the correct data type (string, number).' });
	}

	if (await PermBan.findOne({ RobloxID })) {
		return response.status(409).json({ errorCode: 8, message: 'Inputted Roblox user already exists in the database.' });
	}

	try {
		const player = new PermBan({
			RobloxUsername,
			RobloxID,
			Moderator,
			Reason,
			Date: Date.now(),
		});

		await player.save();
		response.status(200).json({ status: 'ok', message: 'New ban added!' });
	} catch (err: any) {
		return response.status(500).json({ error: err.toString() });
	}
});

/* 
TITLE: Endpoint For Adding Time Bans
URL: http://localhost/v1/timebans/create-new
HEADERS: X-API-KEY
*/

export const addTimeBan = router.post('/timebans/create-new', async (request, response) => {
	const { RobloxUsername, RobloxID, Moderator, Reason, Duration } = request.body;

	if (!RobloxUsername || !RobloxID || !Moderator || !Reason || !Duration) {
		return response.status(400).json({ errorCode: 6, message: 'Some required fields were missing.' });
	}

	if (typeof RobloxUsername !== 'string' || typeof RobloxID !== 'number' || typeof Moderator !== 'string' || typeof Reason !== 'string' || typeof Duration !== 'number') {
		return response.status(400).json({ errorCode: 7, message: 'Inputted values lacked the correct data type (string, number).' });
	}

	if (await TimeBan.findOne({ RobloxID })) {
		return response.status(409).json({ errorCode: 8, message: 'Inputted Roblox user already exists in the database.' });
	}

	try {
		const player = new TimeBan({
			RobloxUsername,
			RobloxID,
			Moderator,
			Reason,
			Date: Date.now(),
			Duration: Duration * 1000,
		});

		await player.save();
		response.status(200).json({ status: 'ok', message: 'New timeban added!' });
	} catch (err: any) {
		return response.status(500).json({ error: err.toString() });
	}
});

/* 
TITLE: Endpoint For Deleting Bans
URL: http://localhost/v1/bans/delete/${userID}
HEADERS: X-API-KEY
*/

export const deleteBan = router.delete('/bans/delete/:RobloxID', async (request, response) => {
	const { RobloxID } = request.params;

	try {
		if (Number.isNaN(Number(RobloxID))) {
			return response.status(400).json({ errorCode: 1, message: 'Roblox ID contains alphabetic characters.' });
		}

		/* Checking if there is a perm ban, if there is, delete it */
		const permbanPlayer = await PermBan.findOne({ RobloxID: Number(RobloxID) });

		if (permbanPlayer) {
			return await PermBan.deleteOne({ RobloxID: Number(RobloxID) }).then(() => {
				response.json({ status: 'ok', message: 'Player unbanned!' });
			});
		}

		/* Checking if there is a time ban, if there is, delete it */
		const timebanPlayer = await TimeBan.findOne({ RobloxID: Number(RobloxID) });

		if (timebanPlayer) {
			return await TimeBan.deleteOne({ RobloxID: Number(RobloxID) }).then(() => {
				response.json({ status: 'ok', message: 'Player unbanned!' });
			});
		}

		/* If no permanent or time ban was found, return an error */
		return response.status(404).json({ errorCode: 2, message: "Roblox player doesn't exist or isn't banned." });
	} catch (err) {
		return response.status(500).json(err);
	}
});

/* 
TITLE: Endpoint For Listing Perm Bans
URL: http://localhost/v1/bans/list-bans
HEADERS: X-API-KEY
*/

export const listPermBans = router.get('/bans/list-bans', async (request, response) => {
	const { sortOrder, limit } = request.query;

	if (!Object.keys(request.query).length || (!sortOrder && !limit)) {
		try {
			return response.json(await PermBan.find({}, '-__v -_id'));
		} catch (err) {
			return response.json({ message: err });
		}
	}

	if (sortOrder && limit) {
		try {
			if (Number.isNaN(Number(limit))) return response.status(400).json({ errorCode: 4, message: 'Limit parameter must be an integer.' });
			return response.json(await PermBan.find({}, '-__v -_id').sort({ RobloxID: sortOrder }).limit(Number(limit)));
		} catch (err: any) {
			if (err.message.includes('Invalid sort value')) {
				return response.status(400).json({ errorCode: 3, message: 'SortOrder allowed values: Asc, Desc' });
			}
			return response.status(500).json({ message: err });
		}
	}

	if (sortOrder) {
		try {
			response.json(await PermBan.find({}, '-__v -_id').sort({ RobloxID: sortOrder }));
		} catch (err: any) {
			if (err.message.includes('Invalid sort value')) {
				return response.status(400).json({ errorCode: 3, message: 'SortOrder allowed values: Asc, Desc' });
			}
			return response.status(500).json({ message: err });
		}
	}

	if (limit) {
		try {
			if (Number.isNaN(Number(limit))) return response.status(400).json({ errorCode: 4, message: 'Limit parameter must be an integer.' });
			response.json(await PermBan.find({}, '-__v -_id').limit(Number(limit)));
		} catch (err) {
			return response.status(500).json({ message: err });
		}
	}
});
