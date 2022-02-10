import { Router, Request, Response } from 'express';

import logger from '../utils/logger';
import { UserController } from '../controllers';

const userController = new UserController();
const userRouter = Router();


userRouter.get('/', async (req: Request, res: Response) => {
  try {
    const users = await userController.getAll();

    res.json(users);

  } catch(error) {
    logger.error(error);
    res.json({ error });
  }
});


export default userRouter;
