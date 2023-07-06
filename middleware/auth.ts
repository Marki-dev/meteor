import { type NextFunction, type Request, type Response } from 'express';

export async function WebAuthHandler(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies.METEOR_WEB_TOKEN as string;
	if (!token) return res.status(401).json({ error: 'Unauthorized.' });

	const usedToken = await req.db.webToken.findFirst({
		where: {
			token
		}
	});
	if (!usedToken) return res.status(401).json({ error: 'Unauthorized.' });
	req.user = await req.db.user.findFirst({
		where: {
			id: usedToken.userId
		}
	}) ?? undefined;
	if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
	next();

	await req.db.webToken.update({
		where: {
			id: usedToken.id
		},
		data: {
			last_seen: new Date()
		}
	});
}
