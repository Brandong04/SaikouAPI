import express, { Router } from 'express';

import robloxBans from '../models/ban';

const router: Router = express.Router();

/* TRUE/FALSE IS USER BANNED */
router.get('/users/:userid/banned', async (request, response) => {
	const { userid } = request.params;

	if (Number.isNaN(Number(userid))) {
		return response.status(400).json({ errorCode: 1, message: 'Roblox ID contains alphabetic characters.' });
	}

	const player = await robloxBans.findOne({ RobloxID: Number(userid) }, '-__v -_id');

	if (!player) {
		return response.json({ banned: false });
	}

	response.json({ banned: true, player });
});

export = router;
