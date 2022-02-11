// TODO: Improvement tip - db service to have an abstraction for data access
import PouchDb from 'pouchdb-node';
import PouchDbFind from 'pouchdb-find';

import config from '../utils/config';
import logger from '../utils/logger';

PouchDb.plugin(PouchDbFind);

const dbUrl = config.get('NODE_ENV').toLocaleLowerCase() === 'production' 
	? config.get('POUCHDB_URL') : config.get('POUCHDB_URL_TEST')

export class DbService {
	private readonly db = new PouchDb(dbUrl);

	constructor() {
    this.db.createIndex({
      index: {
        fields: ['challenger', 'opponent', 'username']
      }
    })
	}

	async create (data: any, returnOptions?: any): Promise<any> {
		logger.info('DbService:create: Create a new entity');

		const result = await this.db.post(data);
		const [entity] = await this.find({
			_id: result.id
		}, returnOptions);

		return entity;
	}

	async update(id: string, data: any, returnOptions?: any): Promise<any> {
		logger.info('DbService:update - update entity');
		const entity = await this.db.get(id);

		await this.db.put({ ...entity, ...data });

		const [doc] = await this.find({ _id: entity._id }, returnOptions);
		return doc;
	}

  async getOne(id: string, returnOptions?: any): Promise<any> {
    const [doc] = await this.find({ _id: id }, returnOptions);
		return doc;
  }

	async find(query: any, returnOptions?: any): Promise<any> {
		logger.info('DbService:find - query for entities');
		const docs = await this.db.find({
			selector: query,
			...returnOptions,
		});

		return docs.docs;
	}

	async reset() {
		await this.db.destroy();
	}
}

