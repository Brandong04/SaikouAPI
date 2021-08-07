import express, { Router } from 'express';

import RobloxBan from '../models/ban';

const router: Router = express.Router();

/* CREATING BAN DOCUMENT */
router.delete('/bans/delete/:RobloxID', async (request, response) => {
	const { RobloxID } = request.params;

	try {
		if (Number.isNaN(Number(RobloxID))) {
			return response.status(400).json({ errorCode: 1, message: 'Roblox ID contains alphabetic characters.' });
		}

		const player = await RobloxBan.findOne({ RobloxID: Number(RobloxID) });

		if (!player) return response.status(404).json({ errorCode: 2, message: "Roblox player doesn't exist or isn't banned." });

		await RobloxBan.deleteOne({ RobloxID: Number(RobloxID) }).then((): void => {
			response.json({ status: 'ok', message: 'Player unbanned!' });
		});
	} catch (err) {
		return response.status(500).json(err);
	}
});

export = router;
