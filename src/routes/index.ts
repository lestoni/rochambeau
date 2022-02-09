import { Router, Request, Response, query } from 'express';

import logger from '../utils/logger';
import config from '../utils/config';
import { pkg, ip } from '../utils/meta';
import { GameController } from '../controllers';
import { Game, GameStatus } from '../entities/game';


const controller = new GameController();
const router = Router();

router.get('/', (req: Request, res: Response): void => {
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

/**
 * endpoints ->
 *  GET /games -> see all games
 *  GET /games/:id -> see one game
 *  POST /games -> new game
 */

router.post('/games', (req: Request, res: Response) => {
  try {
    let game: Game;

    game = controller.create({
      challenger: req.body.challenger,
      opponent: req.body.opponent,
      type: req.body.type,
      moves: [req.body.move]
    });

    res.json(game);

  } catch (error) {
    logger.error(error);
    res.json(error);
  }
});

router.get('/games', (req: Request, res: Response) => {
  try {
    // TODO: Remove when Auth is implemented
    const { challenger, opponent } = req.query;
    const games = controller.getGames({ challenger, opponent, status: 'new' });

    res.json(games)

  } catch(error) {
    logger.error(error);
    res.json(error);
  }
});

router.put('/games/:id', (req: Request, res: Response) => {
  try {
    // TODO: Remove when Auth is implemented
    const game = controller.play(req.params.id, req.body);

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
    res.json(error);
  }
});


export default router;
