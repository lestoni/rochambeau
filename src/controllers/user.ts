import bcrypt from 'bcrypt';
import crypto from 'crypto';

import logger from '../utils/logger';
import { DbService } from '../services/db';
import { User } from '../entities/user';

export class UserController {
	private readonly dbService = new DbService();
	private readonly passSaltRounds = 7;

	constructor() {}

	async getAll(): Promise<User[]> {
		logger.info('UserController:getAll - get all users');

		const docs = await this.dbService.find({
			username: { $exists: true }
		});

		return docs.map(doc => User.create(doc));
	}

	async register(data: any): Promise<User> {
		logger.info('UserController:register - Register new User');
		const { password, username } = data;
		const [userExists] = await this.dbService.find({ username });
		if(userExists) {
			throw { message: 'Username already exists!' };
		}

		const passHash = await bcrypt.hash(password, this.passSaltRounds);

		const user = await this.dbService.create(User.create({ ...data, password: passHash }));

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

		user = await this.dbService.update(user._id, { accessToken });

		return user;

	}

}

