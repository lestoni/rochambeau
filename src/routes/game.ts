import { Router, Request, Response } from 'express';

import logger from '../utils/logger';
import { GameController } from '../controllers';
import { GameStatus } from '../entities/game';


const gameController = new GameController();
const gameRouter = Router();


gameRouter.post('/', async (req: Request, res: Response) => {
  try {
    const game = await gameController.create({
      challenger: req.body.challenger,
      opponent: req.body.opponent,
      moves: [req.body.move]
    });

    res.json(game);

  } catch (error) {
    logger.error(error);
    res.json({ error });
  }
});

gameRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as any;
    const games = await gameController.getGames(_id);

    res.json(games)

  } catch(error) {
    logger.error(error);
    res.json({ error });
  }
});

gameRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const game = await gameController.play(req.params.id, req.body);

    let result = game.status;
    if(result === GameStatus.LOSE) {
      result = GameStatus.WIN;
    } else if(result === GameStatus.WIN) {
      result = GameStatus.LOSE;
    }

    res.json({
      result,
      game,
    });

  } catch(error) {
    logger.error(error);
    res.json({ error });
  }
});

gameRouter.get('/history', async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as any;
    const games = await gameController.history(_id);

    res.json(games)

  } catch(error) {
    logger.error(error);
    res.json({ error });
  }
});


export default gameRouter;
