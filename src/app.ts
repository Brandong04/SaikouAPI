import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { green } from 'chalk';
import { connect } from 'mongoose';

import { methodCheck, tokenAuth, expiredTimeban } from './util/functions';

import isBannedRoute from './routes/isBanned';
import createBanRoute from './routes/createBan';
import deleteBanRoute from './routes/deleteBan';
import allBansRoute from './routes/allBans';
import createTimeban from './routes/createTimeban';

config();
const app: express.Application = express();

/* ALLOWING API USE ON ALL ORIGINS */
app.use(cors({ origin: 'https://roblox.com' }));

/* USE BODY PARSER */
app.use(express.json());

/* EXTRA SECURITY */
app.use(helmet());

/* RATE LIMITING API REQUESTS */
const apiLimiter = rateLimit({
	windowMs: 1000,
	max: 1,
	// @ts-ignore
	message: { errorCode: 11, message: 'Too many requests, please try again later.' },
});

app.use(apiLimiter);

/* USING AUTH MIDDLEWARE */
app.use(tokenAuth);

/* USING ALL ROUTES */
app.use('/v1', isBannedRoute).all('/v1/users/:userid/banned', (request, response) => methodCheck(request, response, 'GET'));
app.use('/v1', createBanRoute).all('/v1/bans/create-new', (request, response) => methodCheck(request, response, 'POST'));
app.use('/v1', deleteBanRoute).all('/v1/bans/delete/:RobloxID', (request, response) => methodCheck(request, response, 'DELETE'));
app.use('/v1', allBansRoute).all('/v1/bans/list-bans', (request, response) => methodCheck(request, response, 'GET'));

app.use('/v1', createTimeban).all('/v1/timebans/create-new', (request, response) => methodCheck(request, response, 'POST'));

/* HANDLING ENDPOINTS THAT DON'T EXIST */
app.all('*', (request: express.Request, response: express.Response) => {
	response.status(404).json({ errorCode: 9, message: `The requested endpoint ${request.url} was not found.` });
});

app.listen(80, async (): Promise<void> => {
	try {
		/* Connecting to Mongo Database */
		await connect(String(process.env.MONGO_PASSWORD), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: true,
			keepAlive: true,
		}).then((): void => console.log(green('[mongo_database]: MongoDB connected!')));

		console.log(green('[api_server]: 🚀 Listening on port 80!'));
	} catch (err) {
		console.error(err);
	}
});

/* Checking if timebans expired every 10 seconds */
setInterval(expiredTimeban, 10000);
