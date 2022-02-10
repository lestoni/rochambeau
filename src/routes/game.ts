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
      type: req.body.type,
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
    // TODO: Remove when Auth is implemented
    const { challenger, opponent } = req.query;
    const games = await gameController.getGames({ challenger, opponent, status: 'new' });

    res.json(games)

  } catch(error) {
    logger.error(error);
    res.json({ error });
  }
});

gameRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    // TODO: Remove when Auth is implemented
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


export default gameRouter;
