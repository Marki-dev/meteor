import { Router } from 'express';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import os from 'os';
import fileUpload from 'express-fileupload';

const router = Router();

/**
 * ? Router Use
 * * This initializes the `express-fileupload` middleware for this router
 */
router.use(fileUpload());

/**
 * @route   GET /
 * ? Status Route
 * @access  Public
 * @returns {Object} Info
 * *
*/
router.post('/', async (req, res) => {
	if (!req.headers.token) return res.status(400).json({ error: 'No token provided.' });

	const user = await req.db.user.findFirst({
		where: {
			uploadToken: req.headers.token as string
		}
	});
	if (!user) return res.status(400).json({ error: 'Invalid token.' });

	let files = req.files?.file;
	if (!req.files || !files) return res.status(400).json({ error: 'No files were uploaded.' });

	if (!Array.isArray(files)) files = [files];

	const urls: string[] = [];

	for (const file of files) {
		const cryptoKey = randomUUID();
		const filename = cryptoKey + extname(file.name);
		const key = [user.username.replace(' ', '-').toLowerCase(), filename].join('/');
		void req.minio.putObject(key, file.data, undefined, {
			'Content-Type': file.mimetype,
		}).then(async upload => {
			async function createUploadID(length = 6) {
				const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
				let id = '';
				for (let i = 0; i < length; i++) {
					const randomIndex = Math.floor(Math.random() * chars.length);
					id += chars.charAt(randomIndex);
				}

				const upload = await req.db.upload.findFirst({
					where: {
						shortId: id
					}
				});

				if (upload) {
					// If the ID already exists, recursively call the function to generate a new one
					return createUploadID(length);
				}

				return id;
			}

			const uploadId = await createUploadID();
			await req.db.upload.create({
				data: {
					shortId: uploadId,
					key,
					filename,
					user: {
						connect: {
							id: user.id
						}
					}
				}
			});
		});
	}

	const response = [
		{
			url: `https://${'AAAAA'}/i/hotGayFurryShit`,
		}
	];

	res.json(response.length === 1 ? response[0] : response);
});

export default router;

