import express, { Router } from 'express';

import PermBan from '../models/ban';
import TimeBan from '../models/timeban';

const router: Router = express.Router();

/* CREATING BAN DOCUMENT */
router.delete('/bans/delete/:RobloxID', async (request, response) => {
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

export = router;
