/* eslint-disable @typescript-eslint/no-namespace */
// INit env vars
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import minio, { Client } from 'minio';
import next from 'next';
import klaw from 'klaw';
import path from 'path';
import cookies from 'cookie-parser';
import { MinioClient } from './structures/MinioClient';

const port = process.env.PORT ?? 3000;
const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();
import { PrismaClient, type User } from '@prisma/client';
const db = new PrismaClient();

const minioClient = new MinioClient({
	endPoint: process.env.S3_ENDPOINT ?? '',
	port: Number(process.env.S3_PORT ?? '9000'),
	useSSL: process.env.S3_USE_SSL === 'true',
	accessKey: process.env.S3_ACCESS_KEY ?? '',
	secretKey: process.env.S3_SECRET_KEY ?? ''
});
void db.$connect().then(() => {
	console.log('Connected to database.');
	void app.prepare().then(async () => {
		server.use((req, _res, next) => {
			req.minio = minioClient;
			req.db = db;
			req.user = undefined;
			if (!req.url.startsWith('/_next')) console.log(req.method + ' ' + req.url);

			next();
		}, express.json(), express.urlencoded({ extended: true }), cookies());

		async function loadRoutes() {
			let routes = 0;
			for await (const file of klaw(__dirname + '/routes')) {
				if (file.stats.isDirectory()) continue;
				const pathData = path.parse(file.path);
				const filepath = pathData.dir
					.replace(process.cwd(), '/api')
					.split('\\')
					.join('/')
					.replace('/routes', '');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const routedFile = await import(file.path);
				routes++;
				console.log(
					`Loading router: ${filepath + '/' + pathData.name.replace('index', '')}`
				);
				server.use(
					filepath + '/' + pathData.name.replace('index', ''),
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					routedFile.default
				);
			}

			return routes;
		}

		const routes = await loadRoutes();
		console.log(`Loaded ${routes} routes.`);

		server.get('*', async (req, res) => handle(req, res));
		server.listen(port, () => {
			console.log(`Server listening on port ${port}`);
		});
	});
});

// Global types
declare global {
	namespace Express {
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface Request {
			minio: MinioClient;
			db: PrismaClient;
			user: User | undefined;
		}
	}
}
