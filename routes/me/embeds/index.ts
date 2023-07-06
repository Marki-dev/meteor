/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-negated-condition */
import { Router } from 'express';
import { WebAuthHandler } from '../../../middleware/auth';

const router = Router();

/**
 * @route   POST /
 * ? reate a new Embed
 * @access  Private
 */

router.post('/', WebAuthHandler, async (req, res) => {
	const {
		enabled,
		name,
		title,
		description,
		provider,
		author,
		color
	} = req.body;

	// Validate the body by ensuring that the values dont exceed the max length
	if (title && title.length > 256) return res.status(400).json({ error: 'Title cannot exceed 256 characters' });
	if (description && description.length > 2048) return res.status(400).json({ error: 'Description cannot exceed 2048 characters' });
	if (provider && provider.length > 256) return res.status(400).json({ error: 'Provider name cannot exceed 256 characters' });
	if (author && author.length > 256) return res.status(400).json({ error: 'Author name cannot exceed 256 characters' });

	// Valdate the color is a valid hex codehttps://open.spotify.com/track/67BEhVyQPe661gMYUyEhLw
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	if (color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) return res.status(400).json({ error: 'Invalid color.' });

	// See if embed already exists by name, if not create it
	let embed = await req.db.embed.findFirst({
		where: {
			userId: req.user?.id,
			name
		}
	});
	if (!embed) {
		embed = await req.db.embed.create({
			data: {
				enabled,
				name,
				title: title ?? '',
				description: description ?? '',
				provider: provider ?? '',
				author: author ?? '',
				color: color ?? '#000000',
				user: {
					connect: {
						id: req.user?.id
					}
				}
			}
		});
		console.log(embed);
	} else {
		embed = await req.db.embed.update({
			where: {
				id: embed.id
			},
			data: {
				enabled,
				name,
				title,
				description,
				provider,
				author,
				color
			}
		});
	}

	res.json(embed);
});

/**
 * @route   GET /
 * ? Get All User Embeds
 * @access  Private
 * @returns {Embed[]}
 * * This route is designed to get all user embeds
*/
router.get('/', WebAuthHandler, async (req, res) => {
	const dbEmbeds = await req.db.embed.findMany({
		where: {
			userId: req.user?.id
		}
	});
	return res.json(dbEmbeds);
});

/**
 * @route   DELETE /:embedId
 * ? Delete a User Embed
 * @access  Private
 * @returns {Embed}
 * * This route is designed to delete a user embed
*/
router.delete('/:embedId', WebAuthHandler, async (req, res) => {
	const { embedId } = req.params;
	const dbEmbed = await req.db.embed.findFirst({
		where: {
			id: Number(embedId),
			userId: req.user?.id
		}
	});

	if (!dbEmbed) return res.status(404).json({ error: 'Embed not found' });

	await req.db.embed.delete({
		where: {
			id: Number(embedId)
		}
	});
	return res.json(dbEmbed);
});

export default router;
