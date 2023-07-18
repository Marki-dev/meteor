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
  if (!req.headers.token)
    return res.status(400).json({ error: 'No token provided.' });

  const user = await req.db.user.findFirst({
    where: {
      uploadToken: req.headers.token as string,
    },
  });
  if (!user) return res.status(400).json({ error: 'Invalid token.' });

  const requestingUrl = new URL(req.url, `http://${String(req.headers.host)}`);

  if (requestingUrl.searchParams.get('url')) {
    async function generateUniqueShorenerID(length: number) {
      if (!length) length = 6;
      const id = genId(length);

      const existingShortner = await req.db.shortendUrl.findFirst({
        where: {
          shortId: String(id),
        },
      });

      if (existingShortner) {
        return generateUniqueShorenerID(length);
      }

      return id;
    }

    const url = requestingUrl.searchParams.get('url');

    if (!url) return res.status(400).json({ error: 'No url provided.' });

    const id = await generateUniqueShorenerID(10);

    await req.db.shortendUrl.create({
      data: {
        shortId: id,
        url,
        created_at: new Date(),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    res.json({
      url: `${user?.activeDomain ?? 'aaa'}/s/${id}`,
    });
  } else {
    let files = req.files?.file;
    if (!req.files || !files)
      return res.status(400).json({ error: 'No files were uploaded.' });
    if (!Array.isArray(files)) files = [files];
    const selfRecord = await req.db.self.findFirst({});
    let urls: string[] = [];
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-loop-func
      await new Promise(resolve => {
        console.log(file);
        const cryptoKey = randomUUID();
        const filename = cryptoKey + extname(file.name);
        const key = [
          user.username.replace(' ', '-').toLowerCase(),
          filename,
        ].join('/');

        void req.minio
          .putObject(key, file.data, undefined, {
            'Content-Type': file.mimetype,
          })
          .then(async () => {
            async function createUploadID(length = 6) {
              const id = genId(length);
              const upload = await req.db.upload.findFirst({
                where: {
                  shortId: id,
                },
              });
              if (upload) {
                // If the ID already exists, recursively call the function to generate a new one
                return createUploadID(length);
              }

              return id;
            }

            const uploadId = await createUploadID();
            const dbres = await req.db.upload.create({
              data: {
                shortId: uploadId,
                key,
                filename,
                user: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });
            const string = `${user.activeDomain ?? 'aaa'}/u/${dbres.shortId}`;
            urls = [...urls, string];
            resolve(true);
          });
      });
    }

    res.json({
      url: urls.length === 1 ? urls[0] : urls,
    });
  }
});

router.get('/:id/data', async (req, res) => {
  const selfRecord = await req.db.self.findFirst({});
  const { id } = req.params;
  if (!id)
    return res.status(500).json({
      error: 'No ID Provided',
    });

  const upload = await req.db.upload.findFirst({
    where: {
      shortId: id,
    },
  });
  res.json(upload);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(500).json({
      error: 'No ID Provided',
    });
  }

  const upload = await req.db.upload.findFirst({
    where: {
      shortId: id,
    },
  });

  if (!upload) {
    return res.json({
      error: 'Invalid ShortId',
    });
  }

  const file = await req.minio.getObject(upload.key);
  res.setHeader('Content-Disposition', 'inline');
  file.pipe(res);
});

/**
 * @route /api/upload/:id/metagen
 */

router.get('/:id/oembed', async (req, res) => {
  const { id } = req.params;
  const upload = await req.db.upload.findFirst({
    where: {
      shortId: id,
    },
  });
  if (!upload) {
    return res.json({
      error: 'Upload does not exist',
    });
  }

  const user = await req.db.user.findFirst({
    where: {
      id: upload.userId,
    },
  });

  if (!user) {
    return res.json({
      error: 'User does not exist',
    });
  }

  return res.json({
    version: '1.0',
    type: 'photo',
    width: 240,
    height: 160,
    title: 'ZB8T0193',
    thumbnail_url:
      'http://farm4.static.flickr.com/3123/2341623661_7c99f48bbf_m.jpg',
    author_name: 'Bees',
    author_url: 'http://www.flickr.com/photos/bees/',
    provider_name: 'Flickr',
    provider_url: 'http://www.flickr.com/',
  });
});

router.get('/:id/:ext', async (req, res) => {
  const selfRecord = await req.db.self.findFirst({});
  const { id } = req.params;
  if (!id)
    return res.status(500).json({
      error: 'No ID Provided',
    });

  const upload = await req.db.upload.findFirst({
    where: {
      shortId: id,
    },
  });
  if (!upload?.shortId) return;
  if (selfRecord?.proxyS3Media) {
    console.log('A');
    res.redirect(
      `/api/upload/${upload?.shortId}/file${extname(upload.filename)}`,
    );
    return;
  }

  console.log('Redirecc');
});

function genId(length: number) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    id += chars.charAt(randomIndex);
  }

  return id;
}

export default router;
