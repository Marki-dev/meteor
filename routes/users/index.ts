import { Router } from 'express';

const router = Router();

/**
 * @route   GET /users/:id
 * @description Get a user by their ID (excluding password)
 * @access  Private
 * @returns {Object} User object (excluding password)
 */
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) return;
		const user = await req.db.user.findFirst({
			where: {
				id: parseInt(id, 10),
			},
			select: {
				id: true,
				username: true,
				created_at: true,
			},
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;
