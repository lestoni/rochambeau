import PouchDb from 'pouchdb-node';
import PouchDbFind from 'pouchdb-find';

import { Game, GameMove, GameStatus, GameType } from '../entities/game';
import config from '../utils/config';
import logger from '../utils/logger';

PouchDb.plugin(PouchDbFind);

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
	private readonly db = new PouchDb(config.get('POUCHDB_URL'));

	constructor() {
		// Indexing for pouchdb??
	}

	async create (data: any): Promise<Game> {
		logger.info('GameController:create: Create a new game');

		// Ensure for player vs computer computer gets a rando move
		if(!data.opponent) {
			data.moves = [this.rockPaperScissors.randomMove()];
		} else {
			data.type = GameType.PVP;
		}
		
		const result = await this.db.post(Game.create(data));
		const game: Game = await this.db.get(result.id);

		return game;
	}

	async play(id: string, data: any): Promise<Game> {
		logger.info('GameController:play - challenge play');
		const game: Game = await this.db.get(id);
		// compare moves and make verdict
		const result = this.rockPaperScissors.getResult(game.moves[0], data.move);

		game.status = result;
		game.moves = [...game.moves, data.move];

		await this.db.put(game);

		return this.db.get(game._id);
	}

	async getGames(query: any): Promise<Game[]> {
		logger.info('GameController:getGames - get games');

		const docs = await this.db.find({
			selector: query,
		});

		return docs.docs.map(doc => Game.create(doc));
	}
}

