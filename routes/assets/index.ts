import { Router } from 'express';
import os from 'os';

const router = Router();

/**
 * @route   GET /:id
 * ? Status Route
 * @access  Public
 * @returns {Object} Info
 * * This route is designed to get a asset by id, if the ENV "PROXY_ASSETS" is set to true
 * * It will return the assets by proxying the request to the asset server
*/

router.get('/:id', async (req, res) => {
	const {id} = req.params;
	if (!id) return res.status(400).json({ error: 'Invalid asset.' });

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
	const upload = await req.db.upload.findFirst({
		where: {
			shortId: id,
		}
	});
	if (!upload) return res.status(404).json({ error: 'Invalid asset.' });

	const user = await req.db.user.findFirst({
		where: {
			id: upload.userId
		}
	});
	if (!user) return res.status(404).json({ error: 'Invalid asset.' });

	if (process.env.PROXY_ASSETS === 'true') {
		const data = await req.minio.getObject(`${user.id}/`);
		return;
	}

	const s3DirectURI = '';
	res.redirect(s3DirectURI);
});

export default router;
