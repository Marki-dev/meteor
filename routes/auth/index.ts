/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Router } from 'express';
import os from 'os';
import { randomBytes } from 'crypto';
import { hashSync, compareSync } from 'bcrypt';
import { WebAuthHandler } from '../../middleware/auth';

const router = Router();

/**
 * @route   POST /register
 * ? Account Registration Route
 * @access  Public
 * @returns {Object} Default User Object
 * @returns {String} @cookie Registered Account Token = METEOR_WEB_TOKEN
 * * This route is designed to let a user register an account
*/
router.post('/register', async (req, res) => {
	const userAgent = req.headers['user-agent'] ?? 'Unknown';
	const ip = req.headers['x-forwarded-for'] as string ?? req.socket.remoteAddress ?? 'Unknown';

	const { username, email, password } = req.body as { username: string; email: string; password: string };

	const errors = [];
	if (!username) errors.push('Username is required.');
	if (!email) errors.push('Email is required.');
	if (!password) errors.push('Password is required.');

	// Email Validation
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Email is invalid.');

	// Password Validation
	if (password.length < 8) errors.push('Password must be at least 8 characters long.');
	if (password.length > 128) errors.push('Password must be less than 128 characters long.');
	if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter.');
	if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter.');
	if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number.');
	if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) errors.push('Password must contain at least one special character.');

	if (errors.length > 0) return res.status(400).json({ errors });

	const usernameTaken = await req.db.user.findFirst({
		where: {
			username
		}
	});
	if (usernameTaken) return res.status(400).json({ errors: ['Username is already taken.'] });
	const emailTaken = await req.db.user.findFirst({
		where: {
			email
		}
	});
	if (emailTaken) return res.status(400).json({ errors: ['Email is already taken.'] });

	const hashedPassword = hashSync(password, 10);

	const user = await req.db.user.create({
		data: {
			username,
			email,
			password: hashedPassword,
			uploadToken: 'upload_' + randomBytes(64).toString('hex'),
		}
	});

	// Generate and save the token to the database
	const token = 'web_' + randomBytes(64).toString('hex');
	const webToken = await req.db.webToken.create({
		data: {
			token,
			ip_address: ip,
			user_agent: userAgent,
			user: {
				connect: {
					id: user.id
				}
			}
		}
	});

	// Set the cookie
	res.cookie('METEOR_WEB_TOKEN', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 1000 * 60 * 60 * 24 * 365
	});

	res.json({
		id: user.id,
		username: user.username,
		email: user.email,
		avatar: user.avatar,
	});

	// Set Up user defaults

	// first default embed
	const embed = await req.db.embed.create({
		data: {
			enabled: true,
			name: 'Default Embed',
			title: 'Upload {{upload.id}}',
			description: 'Uploaded by {{user.username}}',
			color: '#7289DA',
			author: 'Meteor',
			user: {
				connect: {
					id: user.id
				}
			}
		}
	});
});

/**
 * @route   POST /login
 * ? Account Login Route
 * @access  Public
 * @returns {Object} Default User Object
 * * This route is designed to let a user login to their account
 */

router.post('/login', async (req, res) => {
	const userAgent = req.headers['user-agent'] ?? 'Unknown';
	const ip = req.headers['x-forwarded-for'] as string ?? req.socket.remoteAddress ?? 'Unknown';

	const { username, password } = req.body as { username: string; password: string };

	const errors = [];
	if (!username) errors.push('Username is required.');
	if (!password) errors.push('Password is required.');

	// Email Validation
	// Password Validation
	if (password.length < 8) errors.push('Password must be at least 8 characters long.');
	if (password.length > 128) errors.push('Password must be less than 128 characters long.');

	if (errors.length > 0) return res.status(400).json({ errors });

	// Fetch the user that is trying to login
	const user = await req.db.user.findUnique({
		where: {
			username
		}
	});
	if (!user) return res.status(400).json({ errors: ['Email or password is incorrect.'] });

	// Compare the password with the saved hash in the database
	const passwordMatch = compareSync(password, user.password);
	if (!passwordMatch) return res.status(400).json({ errors: ['Email or password is incorrect.'] });

	// Generate and save the token to the database
	const token = 'web_' + randomBytes(64).toString('hex');
	const webToken = await req.db.webToken.create({
		data: {
			token,
			ip_address: ip,
			user_agent: userAgent,
			user: {
				connect: {
					id: user.id
				}
			}
		}
	});

	// Set the cookie
	res.cookie('METEOR_WEB_TOKEN', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 1000 * 60 * 60 * 24 * 365
	});

	res.json({
		...user,
		password: undefined
	});
});

/**
 * @route   POST /logout
 * ? Account Logout Route
 * @access  Private
 * @returns {Null}
 * * This route is designed to let a user logout of their account, Purges the token from the database
 */

router.post('/logout', WebAuthHandler, async (req, res) => {
	const token = req.cookies.METEOR_WEB_TOKEN;

	// Delete the token from the database
	await req.db.webToken.deleteMany({
		where: {
			token
		}
	});
	res.clearCookie('METEOR_WEB_TOKEN');
	res.json({ success: true });
});

export default router;
