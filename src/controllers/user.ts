import bcrypt from 'bcrypt';
import crypto from 'crypto';

import logger from '../utils/logger';
import { DbService } from '../services/db';
import { User } from '../entities/user';
import { Game, GameStatus, GameType } from '../entities/game';

export class UserController {
	private readonly dbService = new DbService();
	private readonly passSaltRounds = 7;

	constructor() {}

	async getAll(): Promise<User[]> {
		logger.info('UserController:getAll - get all users');

		const docs = await this.dbService.find({
			username: { $exists: true }
		}, {
			fields: ['_id', 'username', 'score']
		});

		return docs.map(doc => User.create(doc));
	}

	async getOne(query: any): Promise<User> {
		logger.info('UserController:getOne - get a user');

		const [doc] = await this.dbService.find(query, {
			fields: ['_id', 'username', 'score']
		});

		return User.create(doc);
	}

	async register(data: any): Promise<User> {
		logger.info('UserController:register - Register new User');
		const { password, username } = data;
		const [userExists] = await this.dbService.find({ username });
		if(userExists) {
			throw { message: 'Username already exists!' };
		}

		const passHash = await bcrypt.hash(password, this.passSaltRounds);

		const user = await this.dbService.create(User.create({ ...data, password: passHash }), {
			fields: ['_id', 'username', 'score']
		});

		return user;
	}

	async login(data: any): Promise<User> {
		logger.info('UserController:login - Login  User');
		const { password, username } = data;

		// check if user exists
		let [user] = await this.dbService.find({ username });
		if(!user) {
			throw { message: 'user does not exists!' };
		}

		const isValid = await bcrypt.compare(password, user.password);
		if(!isValid) {
			throw { message: 'Invalid credentials' };
		}

		// generate bearer auth token
		const accessToken = crypto.randomUUID();

		user = await this.dbService.update(user._id, { accessToken }, {
			fields: ['_id', 'username', 'score', 'accessToken']
		});

		return user;
	}

	async updateScore(game: Game): Promise<User> {
		logger.info(`UserController:updateScore - game score ${game.status}`)
		// update challenger and opponent scores
		const { challengerId, opponentId, type, status } = game;

		let challenger = await this.getOne({ _id: challengerId });
		let opponent: User;

		if(type === GameType.PVP) opponent = await this.getOne({ _id: opponentId });
		
		if(status === GameStatus.WIN) {
			if(type === GameType.PVC) {
				challenger = await this.dbService.update(challengerId, {
					score: (challenger.score + 10)
				});

			} else {
				[challenger, opponent] = await Promise.all([
					this.dbService.update(challengerId, {
						score: (challenger.score + 10)
					}),
					this.dbService.update(opponentId, {
						score: !opponent.score ? 0 : (opponent.score - 5)
					})
				]);
			}

		} else if(status === GameStatus.LOSE) {
			if(type === GameType.PVC) {
				challenger = await this.dbService.update(challengerId, {
					score: !challenger.score ? 0 : (challenger.score - 5)
				});
			} else {
				[challenger, opponent] = await Promise.all([
					this.dbService.update(challengerId, {
						score: !challenger.score ? 0 : (challenger.score - 5)
					}),
					this.dbService.update(opponentId, {
						score: (opponent.score + 10)
					})
				]);
			}
		}

		return opponent || challenger;
	}

}

