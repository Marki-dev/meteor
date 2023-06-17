import { Router } from 'express';
import { WebAuthHandler } from '../../middleware/auth';
import { compare } from 'bcrypt';

const router = Router();

/**
 * @route   GET /me
 * ? Get Current User Route
 * @access  Private
 * @returns {Object} Default User Object
 * * This route is designed to get the current user's information
 */

router.get('/', WebAuthHandler, async (req, res) => {
	res.json({
		...req.user,
		password: undefined
	});
});

/**
 * @route   DELETE /
 * ? Delete Current User Route
 * @access  Private
 * @returns {{success: boolean}}
 * * This route is designed to delete the current user, and all of their data
 * * it should require a password to be sent in the body
 */

router.delete('/', WebAuthHandler, async (req, res) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { password } = req.body;
	if (!password) return res.status(400).json({ error: 'No password provided' });

	const user = await req.db.user.findFirst({
		where: {
			id: req.user?.id
		}
	});
	if (!user) return res.status(400).json({ error: 'Invalid user.' });
	// Compare passwords with bcrypt
	const match = await compare(password as string, user.password);

	if (!match) return res.status(400).json({ error: 'Invalid password.' });

	// Delete all user data
	await req.db.embed.deleteMany({
		where: {
			userId: req.user?.id
		}
	});
	await req.db.webToken.deleteMany({
		where: {
			userId: req.user?.id
		}
	});
	await req.db.user.delete({
		where: {
			id: req.user?.id
		}
	});
	return res.json({ success: true });
});

export default router;
