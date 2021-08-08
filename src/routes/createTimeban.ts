import express, { Router } from 'express';

import RobloxTimeban from '../models/timeban';

const router: Router = express.Router();

/* CREATING BAN DOCUMENT */
router.post('/timebans/create-new', async (request, response) => {
	const { RobloxUsername, RobloxID, Moderator, Reason, Duration } = request.body;

	if (!RobloxUsername || !RobloxID || !Moderator || !Reason || !Duration) {
		return response.status(400).json({ errorCode: 6, message: 'Some required fields were missing.' });
	}

	if (typeof RobloxUsername !== 'string' || typeof RobloxID !== 'number' || typeof Moderator !== 'string' || typeof Reason !== 'string' || typeof Duration !== 'number') {
		return response.status(400).json({ errorCode: 7, message: 'Inputted values lacked the correct data type (string, number).' });
	}

	if (await RobloxTimeban.findOne({ RobloxID })) {
		return response.status(409).json({ errorCode: 8, message: 'Inputted Roblox user already exists in the database.' });
	}

	try {
		const player = new RobloxTimeban({
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

export = router;
