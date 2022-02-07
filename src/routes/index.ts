import { Router, Request, Response } from 'express';

import logger from '../utils/logger';
import config from '../utils/config';
import { pkg, ip } from '../utils/meta';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  logger.info('View api info');

  const port = config.get('Port');
  const { version, name, description } = pkg;

  res.json({
    message: 'Welcome to Gulag!',
    documentation:`http://localhost:${port}/docs or http://${ip}:${port}/docs`,
    version,
    description,
    name
  });
});


export default router;
