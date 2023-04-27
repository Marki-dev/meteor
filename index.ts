import express from 'express';
import next from 'next';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

app.prepare().then(() => {
    server.get('*', (req, res) => {
        return handle(req, res);
    });
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
});
