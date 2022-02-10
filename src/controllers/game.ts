import { Game, GameMove, GameStatus, GameType } from '../entities/game';
import logger from '../utils/logger';
import { DbService } from '../services/db';

class RockPaperScissors {
	constructor() {}

	randomMove(): string {
		const moves = Object.keys(GameMove)
		return moves[Math.floor(Math.random() * moves.length)].toLocaleLowerCase();
	}

	getResult(firstMove: GameMove, otherMove: GameMove): GameStatus {
		if(firstMove === otherMove) {
			return GameStatus.TIE;
		}

		if(firstMove === GameMove.ROCK) {
			if(otherMove === GameMove.SCISSORS) {
				return GameStatus.WIN;
			} else {
				return GameStatus.LOSE;
			}
		}

		if(firstMove === GameMove.PAPER) {
			if(otherMove === GameMove.ROCK) {
				return GameStatus.WIN;
			} else {
				return GameStatus.LOSE;
			}
		}

		if(firstMove === GameMove.SCISSORS) {
			if(otherMove === GameMove.PAPER) {
				return GameStatus.WIN;
			} else {
				return GameStatus.LOSE;
			}
		}

		throw new Error(`${otherMove} is not a valid game move!`)
	}
}

export class GameController {

	private readonly rockPaperScissors = new RockPaperScissors();
	private readonly dbService = new DbService();

	constructor() {}

	async create (data: any): Promise<Game> {
		logger.info('GameController:create: Create a new game');

		// Ensure for player vs computer computer gets a rando move
		if(!data.opponent) {
			data.moves = [this.rockPaperScissors.randomMove()];
		} else {
			data.type = GameType.PVP;
		}

    const game: Game = await this.dbService.create(Game.create(data));

		return game;
	}

	async play(id: string, data: any): Promise<Game> {
		logger.info('GameController:play - challenge play');
		const game: Game = await this.dbService.getOne(id);
    if(game.status !== GameStatus.NEW) {
      throw { error: 'Challenge completed!' };
    }
		// compare moves and make verdict
		const result = this.rockPaperScissors.getResult(game.moves[0], data.move);

    return this.dbService.update(id, {
      status: result,
      moves: [...game.moves, data.move]
    });
	}

	async getGames(query: any): Promise<Game[]> {
		logger.info('GameController:getGames - get games');

		const docs = await this.dbService.find(query);

		return docs.map(doc => Game.create(doc));
	}
}

