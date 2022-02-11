import { Router, Request, Response } from 'express';

import logger from '../utils/logger';
import { GameController, UserController } from '../controllers';
import { User } from '../entities/user';
import { GameType } from '../entities/game';


const gameController = new GameController();
const userController = new UserController();
const gameRouter = Router();

// Create game
gameRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as User;
    let game = await gameController.create(_id, {
      challengerId: _id,
      opponentId: req.body.opponentId,
      moves: [req.body.move]
    });

    if(game.type === GameType.PVC) {
      // Let computer play and return result asap
      const { game: updatedGame, result } = await gameController.play(_id, game._id, {
        move: gameController.randomMove,
      });
      // update score
      const { score } = await userController.updateScore(updatedGame);

      return res.json({ result, score, game: updatedGame });
    }

    res.json(game);

  } catch (error) {
    logger.error(error);
    res.json({ error });
  }
});

gameRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as User;
    const games = await gameController.getGames(_id);

    res.json(games)

  } catch(error) {
    logger.error(error);
    res.json({ error });
  }
});

// Play Game
// only play when i'm opponent
gameRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as User;
    const { result, game } = await gameController.play(_id, req.params.id, req.body);

    const user = await userController.updateScore(game);

    res.json({ result, score: user.score, game });

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
