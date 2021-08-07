import express, { Router } from 'express';

import robloxBans from '../models/ban';

const router: Router = express.Router();

/* CREATING BAN DOCUMENT */
router.get('/bans/list-bans', async (request, response) => {
	const { sortOrder, limit } = request.query;

	if (!Object.keys(request.query).length || (!sortOrder && !limit)) {
		try {
			return response.json(await robloxBans.find({}, '-__v -_id'));
		} catch (err) {
			return response.json({ message: err });
		}
	}

	if (sortOrder && limit) {
		try {
			if (Number.isNaN(Number(limit))) return response.status(400).json({ errorCode: 4, message: 'Limit parameter must be an integer.' });
			return response.json(await robloxBans.find({}, '-__v -_id').sort({ RobloxID: sortOrder }).limit(Number(limit)));
		} catch (err: any) {
			if (err.message.includes('Invalid sort value')) {
				return response.status(400).json({ errorCode: 3, message: 'SortOrder allowed values: Asc, Desc' });
			}
			return response.status(500).json({ message: err });
		}
	}

	if (sortOrder) {
		try {
			response.json(await robloxBans.find({}, '-__v -_id').sort({ RobloxID: sortOrder }));
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
			response.json(await robloxBans.find({}, '-__v -_id').limit(Number(limit)));
		} catch (err) {
			return response.status(500).json({ message: err });
		}
	}
});

export = router;
