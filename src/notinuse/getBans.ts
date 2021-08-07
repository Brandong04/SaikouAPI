import express, { Router } from 'express';

import robloxBans from '../models/ban';

const router: Router = express.Router();

/* FETCH SPECIFIC BANS BY ROBLOX ID */
router.get('/bans/:nameorid', async (request, response) => {
	const { nameorid } = request.params;

	try {
		if (Number.isNaN(Number(nameorid))) {
			const playerByUsername = await robloxBans.findOne({ RobloxUsername: nameorid }, '-__v -_id');

			if (!playerByUsername) return response.status(400).json({ errorCode: 2, message: "Roblox player doesn't exist or isn't banned." });
			return response.json(playerByUsername);
		}

		const player = await robloxBans.findOne({ RobloxID: Number(nameorid) }, '-__v -_id');

		if (!player) return response.status(400).json({ errorCode: 2, message: "Roblox player doesn't exist or isn't banned." });
		response.json(player);
	} catch (err) {
		return response.status(500).json(err);
	}
});

// export = router;
