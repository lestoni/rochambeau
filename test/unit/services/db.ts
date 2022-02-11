import { expect, use } from 'chai';
import * as Sinon from 'sinon';
import SinonChai from 'sinon-chai';

import { DbService } from '../../../src/services/db';
import { mockGame, mockGameDoc } from '../../fixtures/unit/db-fixture';

use(SinonChai);

describe('GithubService', () => {
  let dbService: DbService;
  let sandbox = Sinon.createSandbox();

  beforeEach(() => {
    dbService = new DbService();

    sandbox.stub(dbService, 'create')
      .withArgs(mockGame, { fields: ['moves', 'status']})
      .resolves(mockGameDoc);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a new document in db', async () => {
    const response = await dbService.create(mockGame, { fields: ['moves', 'status']});

    expect(response).to.eql(mockGameDoc);
    expect(dbService.create).to.have.been.calledOnceWith(mockGame, { fields: ['moves', 'status']});
  });

});
