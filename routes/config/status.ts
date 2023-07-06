import { Router } from 'express';
import os from 'os';

const router = Router();

/**
 * @route   GET /
 * ? Status Route
 * @access  Public
 * @returns {Object} Info
 * * This route is designed for the front-end to figure out where the main page needs
 * * to send the user to
*/
router.get('/', (req, res) => {
	res.json({
		goTo: '/config/setup'
	});
});

export default router;
