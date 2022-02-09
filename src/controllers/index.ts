import { Game, GameMove, GameStatus } from '../entities/game';
import logger from '../utils/logger';

const db:Game[] = [];

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
			if(otherMove === GameMove.PAPER) {
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

	constructor() {}

	create (data: any): Game {
		logger.info('Create a new game');
		// TODO: Refactor
		const id = String(Math.random() * 10000000);
		if(!data.opponent) {
			data.moves = [this.rockPaperScissors.randomMove()];
		}
		const game = Game.create({ ...data, id });
		db.push(game);

		return game;
	}

	play(id: string, data: any): Game {
		logger.info('play game')
		const game = db.find(game => game.id === id);

		// compare moves and make verdict
		const result = this.rockPaperScissors.getResult(game.moves[0], data.move);

		game['status'] = result;
		game.moves = [...game.moves, data.move];

		return game;
	}

	getGames(query: any): Game[] {
		logger.info('get games');
		return db.filter(game => {
			return !!Object.keys(query).find(key => {
				return game[key] === query[key];
			})?.length;
		});
	}
}

