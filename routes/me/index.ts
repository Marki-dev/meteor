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
    password: undefined,
  });
});

/**
 * @route /api/me/uploads
 * ? URL Parameters: from: number; to: number; limit: number;
 */
router.get('/uploads', WebAuthHandler, async (req, res) => {
  // Parse query parameters
  const { from, to, limit } = req.query;
  const fromIndex = from ? parseInt(from as string, 10) : undefined;
  const toIndex = to ? parseInt(to as string, 10) : undefined;
  const limitValue = limit ? parseInt(limit as string, 10) : undefined;

  // Validate query parameters
  const totalUploads = await req.db.upload.count();

  const fromItem =
    fromIndex === undefined ? undefined : Math.max(totalUploads - fromIndex, 0);

  const toItem =
    toIndex === undefined ? undefined : Math.max(totalUploads - toIndex - 1, 0);

  try {
    // Calculate the limit based on the 'from' and 'to' parameters if 'limit' is undefined
    const calculatedLimit = limitValue ?? undefined;

    // Query uploads with pagination and filtering
    const uploads = await req.db.upload.findMany({
      where: {
        userId: req.user?.id,
        created_at: {
          gte: new Date(0),
        },
      },
      skip: toItem,
      take: calculatedLimit,
      orderBy: [
        {
          created_at: 'desc',
        },
        {
          id: 'asc',
        },
      ],
    });

    res.json({ uploads });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'No password provided' });

  const user = await req.db.user.findFirst({
    where: {
      id: req.user?.id,
    },
  });
  if (!user) return res.status(400).json({ error: 'Invalid user.' });
  // Compare passwords with bcrypt
  const match = await compare(password as string, user.password);

  if (!match) return res.status(400).json({ error: 'Invalid password.' });

  // Delete all user data
  await req.db.embed.deleteMany({
    where: {
      userId: req.user?.id,
    },
  });
  await req.db.webToken.deleteMany({
    where: {
      userId: req.user?.id,
    },
  });
  await req.db.user.delete({
    where: {
      id: req.user?.id,
    },
  });
  return res.json({ success: true });
});

export default router;
