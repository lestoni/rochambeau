// TODO: Improvement tip - db service to have an abstraction for data access
import PouchDb from 'pouchdb-node';
import PouchDbFind from 'pouchdb-find';

import config from '../utils/config';
import logger from '../utils/logger';

PouchDb.plugin(PouchDbFind);

export class DbService {
	private readonly db = new PouchDb(config.get('POUCHDB_URL'));

	constructor() {
		// Indexing for pouchdb??
    this.db.createIndex({
      index: {
        fields: ['challenger', 'opponent', 'username']
      }
    })
	}



	async create (data: any): Promise<any> {
		logger.info('DbSrvice:create: Create a new entity');

		const result = await this.db.post(data);
		const entity = await this.db.get(result.id);

		return entity;
	}

	async update(id: string, data: any): Promise<any> {
		logger.info('DbService:update - update entity');
		const entity = await this.db.get(id);

		await this.db.put({ ...entity, ...data });

		return this.db.get(entity._id);
	}

  async getOne(id: string): Promise<any> {
    return this.db.get(id);
  }

	async find(query: any): Promise<any> {
		logger.info('DbService:find - query for entities');
		const docs = await this.db.find({
			selector: query,
		});

		return docs.docs;
	}
}

