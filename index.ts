import express from 'express';
import next from 'next';
import klaw from 'klaw';
import path from 'path';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

app.prepare().then(async () => {

    server.use((req, res, next) => {
        console.log(req.method + ' ' + req.url);
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
