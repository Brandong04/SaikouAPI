import { Request, Response } from 'express';

/* API AUTHENTICATION MIDDLEWARE */
export function tokenAuth(request: Request, response: Response, next: any) {
	const { token } = request.headers;

	if (!token || token !== process.env.API_TOKEN) return response.status(401).json({ errorCode: 5, message: 'Unathorised request, please pass through an API token.' });
	next();
}

export function methodCheck(request: Request, response: Response, validMethod: string) {
	response.set('Allow', validMethod);
	return response.status(405).json({ errorCode: 10, message: `The provided method ${request.method} is not allowed for this ${validMethod} endpoint.` });
}
