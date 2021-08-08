import express, { Router } from 'express';

import permBans from '../models/ban';
import timeBans from '../models/timeban';

const router: Router = express.Router();

/* TRUE/FALSE IS USER BANNED */
router.get('/users/:userid/banned', async (request, response) => {
	const { userid } = request.params;

	if (Number.isNaN(Number(userid))) {
		return response.status(400).json({ errorCode: 1, message: 'Roblox ID contains alphabetic characters.' });
	}

	/* Checking if they have a permanent ban */
	const permbanPlayer = await permBans.findOne({ RobloxID: Number(userid) }, '-__v -_id');

	if (permbanPlayer) {
		return response.json({ banned: true, type: 'permban', player: permbanPlayer });
	}

	/* Checking if they have a temporary ban */
	const timebanPlayer = await timeBans.findOne({ RobloxID: Number(userid) }, '-__v -_id');

	if (timebanPlayer) {
		return response.json({ banned: true, type: 'timeban', player: timebanPlayer });
	}

	/* If user doesn't have either a temp or perm ban, return false */
	return response.json({ banned: false });
});

export = router;
