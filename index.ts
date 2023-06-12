// INit env vars
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import minio, { Client } from "minio"
import next from 'next';
import klaw from 'klaw';
import path from 'path';

const port = process.env.PORT || 3000;
const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

const minioClient = new Client({
    endPoint: process.env.S3_ENDPOINT || "",
    port: parseInt(process.env.S3_PORT || "9000"),
    accessKey: process.env.S3_ACCESS_KEY || "",
    secretKey: process.env.S3_SECRET_KEY || ""
})


app.prepare().then(async () => {

    server.use((req, res, next) => {
        if (!req.url.startsWith("/_next")) console.log(req.method + ' ' + req.url);
        next();
    });

    async function loadRoutes() {
        let routes = 0
        for await (const file of klaw(__dirname + '/routes')) {
            if (file.stats.isDirectory()) continue;
            const pathData = path.parse(file.path);
            const filepath = pathData.dir
                .replace(process.cwd(), '/api')
                .split('\\')
                .join('/')
                .replace('/routes', '');
            const routedFile = await import(file.path);
            routes++
            console.log(
                `Loading router: ${filepath + '/' + pathData.name.replace('index', '')}`
            );
            server.use(
                filepath + '/' + pathData.name.replace('index', ''),
                routedFile.default
            );
        }
        return routes;
    }

    const routes = await loadRoutes();
    console.log(`Loaded ${routes} routes.`);

    server.get('*', (req, res) => {
        return handle(req, res);
    });
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
});
