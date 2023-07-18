import { Router } from 'express';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import os from 'os';
import fileUpload from 'express-fileupload';
import { WebAuthHandler } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /me
 * ? Status Route
 * @access  Private
 * @returns {URL)
 * * Gets All the users shotened URLs
 */
router.get('/me', WebAuthHandler, async (req, res) => {
  const urls = await req.db.shortendUrl.findMany({
    where: {
      userId: req.user?.id,
    },
  });
  res.json(urls);
});

/**
 * @route   DELETE /:id
 * @desc    Delete a shortened URL by ID
 * @access  Private
 */
router.delete('/:id', WebAuthHandler, async (req, res) => {
  try {
    const urlId = parseInt(req.params.id, 10);
    const url = await req.db.shortendUrl.findUnique({
      where: {
        id: urlId,
      },
    });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    if (url.userId !== req.user?.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    await req.db.shortendUrl.delete({
      where: {
        id: urlId,
      },
    });

    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route   GET /:id
 * ? Status Route
 * @access  Public
 * @returns {URL)
 * * Gets the URL for a shortened URI
 */
router.get('/:id', async (req, res) => {
  const shortendUrl = await req.db.shortendUrl.findFirst({
    where: {
      shortId: req.params.id,
    },
  });

  if (!shortendUrl)
    return res.status(404).json({ error: 'Invalid shortend url.' });

  // Increment view count
  await req.db.shortendUrl.update({
    where: {
      shortId: req.params.id,
    },
    data: {
      views: shortendUrl.views + 1,
      last_viewed: new Date(),
    },
  });

  // Redirect to the url with user base-domain and the shortend url

  res.json({ url: shortendUrl?.url });
});

export default router;
