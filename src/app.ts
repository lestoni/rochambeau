import path from 'path';
import fs from 'fs';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import gracefulShutdown from 'http-graceful-shutdown';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import logger from './utils/logger';
import config from './utils/config';
import { ip } from './utils/meta';
import bindRoutes from './routes';
import swaggerDocument from './swagger/swagger.json';

const app = express();

app.use(morgan('tiny'));

app.use(bodyParser.json());

// Serve Swaggger API Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Dev-only: tiny UI
// app.use('/ui', express.static('./public'));

// API Routes Handler
bindRoutes(app);

// Default handler for unknown routes
app.use('*', (req, res) => {
    res.statusCode = 404;
    res.json({
        error: {
            message: 'End of the road Buster!!'
        }
    });
});


const port = config.get('PORT');
const server = app.listen(port, () => {
    logger.info(`Rochambeau: App running on - http://localhost:${port} or http://${ip}:${port}`);
    logger.info(`Rochambeau: Documentation available on - http://localhost:${port}/docs or http://${ip}:${port}/docs`);
});


if (config.get('NODE_ENV')?.toLowerCase() === 'production') {
    // enable graceful shutdown
    gracefulShutdown(server, {
        onShutdown: () => {
            logger.info('gracefulShutdown:done - Cleanup done');
            return Promise.resolve();
        }
    });
}

// Handle unexpected process errors
process.on('uncaughtException', (err) => {
    logger.error('Application experienced an unexpected error', err);
    process.exit(1);
});

export default app;
