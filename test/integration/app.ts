import request from 'supertest';
import { expect } from 'chai';
import * as Sinon from 'sinon';

import app from '../../src/app';


describe('Rochambeau:App', () => {
  let sandbox;

  beforeEach(async () => {
    sandbox = Sinon.createSandbox();
  });

  afterEach(async () => {
    sandbox.restore();
  });


  it('/GET docs - Returns Swagger Documentation', async () => {
    const response = await request(app)
      .get('/docs');

    expect(response.headers['content-type']).to.match(/html/);
    expect(response.headers['location']).to.equal('/docs/');
  });

  it('/POST|PUT|DELETE|*  * - Returns 404 on unknown routes', async() => {
    const response = await request(app)
      .get('/track');

    expect(response.headers['content-type']).to.match(/json/);
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('error');
  });
});
