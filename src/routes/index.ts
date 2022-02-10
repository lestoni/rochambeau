import { Request, Response, Express } from 'express';

import logger from '../utils/logger';
import config from '../utils/config';
import { pkg, ip } from '../utils/meta';
import authRouter from './auth';
import gameRouter from './game';
import userRouter from './user';
import { AuthService } from '../services/auth';


function bindRoutes(app: Express) {
  
  AuthService.init(app);

  app.use('/v1/auth', authRouter);

  app.use('/v1/users', AuthService.authenticate(), userRouter);

  app.use('/v1/games', AuthService.authenticate(), gameRouter);

  app.use('/v1', (req: Request, res: Response): void => {
    logger.info('View api info');
  
    const port = config.get('PORT');
    const { version, name, description } = pkg;
  
    res.json({
      message: 'Welcome to Gulag!',
      documentation: `http://localhost:${port}/docs or http://${ip}:${port}/docs`,
      version,
      description,
      name
    });
  }); 
}


export default bindRoutes;
