import { Router, Request, Response } from 'express';

import logger from '../utils/logger';
import { UserController } from '../controllers';

const userController = new UserController();
const authRouter = Router();


authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await userController.register(req.body);

    res.json(user);

  } catch(error) {
    logger.error(error);
    res.json({ error });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const user = await userController.login(req.body);

    res.json(user);

  } catch(error) {
    logger.error(error);
    res.json({ error });
  }
});


export default authRouter;
