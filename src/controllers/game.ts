import { Game, GameMove, GameStatus, GameType } from '../entities/game';
import logger from '../utils/logger';
import { DbService } from '../services/db';

export class RockPaperScissors {
	constructor() {}

	randomMove(): string {
		const moves = Object.keys(GameMove)
		return moves[Math.floor(Math.random() * moves.length)].toLocaleLowerCase();
	}

	getResult(firstMove: any, otherMove: any): GameStatus {
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

	async create (userId: string, data: any): Promise<Game> {
		logger.info('GameController:create: Create a new game');

		if(data.opponentId) {
			data.type = GameType.PVP;
		}

    let game: Game = await this.dbService.create(Game.create(data));

		return game;
	}

	get randomMove () {
		return this.rockPaperScissors.randomMove();
	}


	async play(userId: string, gameId: string, data: any): Promise<any> {
		logger.info('GameController:play - challenge play');
		let game: Game = await this.dbService.getOne(gameId);
    if(game.status !== GameStatus.NEW) {
      throw { error: 'Challenge completed!' };
    }
		
		if(game.opponentId !== userId && game.type !== GameType.PVC) {
			throw { error: 'Do not play yourself!' };
		}

		// compare moves and make verdict
		const challengerResult = this.rockPaperScissors.getResult(
			game.moves[0].toLocaleLowerCase(),
			data.move.toLocaleLowerCase(),
		);

		let opponentResult: GameStatus;
    if(challengerResult === GameStatus.WIN) {
      opponentResult = GameStatus.LOSE;
    } else if(challengerResult === GameStatus.LOSE) {
      opponentResult = GameStatus.WIN;
    } else {
			opponentResult = challengerResult;
		}

    game = await this.dbService.update(gameId, {
      status: challengerResult,
      moves: [...game.moves, data.move]
    });

		let result: any;

		if(game.type === GameType.PVC) {
			result = challengerResult;
		} else {
			result = opponentResult;
		}

		return { result, game };
	}

	async getGames(userId: string): Promise<Game[]> {
		logger.info('GameController:getGames - get new challenged games');

		const docs = await this.dbService.find({
			opponentId: userId,
			status: GameStatus.NEW
		});

		return docs.map(doc => Game.create(doc));
	}

	async history(userId: string): Promise<Game[]> {
		logger.info('GameController:history - view all games');

		const docs = await this.dbService.find({
			$or: [
				{ challengerId: userId },
				{ opponent: userId }
			]
		});

		return docs.map(doc => Game.create(doc));
	}
}

