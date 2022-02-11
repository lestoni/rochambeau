import request from 'supertest';
import { expect } from 'chai';
import * as Sinon from 'sinon';

import app from '../../src/app';
import { testUser } from '../fixtures/integration/app-fixture';
import { DbService } from '../../src/services/db';
import { GameStatus, GameType } from '../../src/entities/game';

const dbService = new DbService();

describe('Rochambeau:App', () => {
  let sandbox;
  let gamer;
  let suiteGame;

  before(async () => {
    sandbox = Sinon.createSandbox();
  });

  after(async () => {
    sandbox.restore();
    await dbService.reset();
  });

  describe('#General', () => {
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

  describe('#Auth', () => {
    it('POST /auth/register - Register User', async () => {
      const response = await request(app)
        .post('/v1/auth/register')
        .send(testUser);
  
      expect(response.headers['content-type']).to.match(/json/);
      expect(response.status).to.equal(200);

      const user = response.body;

      ['_id',  'username', 'score'].forEach(prop => {
        expect(user).to.have.property(prop);
      });

      expect(user.score).to.equal(0);
      expect(user.username).to.equal(testUser.username)
    });

    it('POST /auth/login - Login to get accessToken', async () => {
      const response = await request(app)
        .post('/v1/auth/login')
        .send(testUser);
  
      expect(response.headers['content-type']).to.match(/json/);
      expect(response.status).to.equal(200);

      const user = response.body;
      ['_id',  'username', 'accessToken'].forEach(prop => {
        expect(user).to.have.property(prop);
      });

      expect(user.accessToken).to.have.lengthOf.above(1);
      expect(user.username).to.equal(testUser.username);

      gamer = user;
    });
  });
  describe('#Game', () => {
    it('POST /games - start a new challenge with computer', async () => {
      const response = await request(app)
        .post('/v1/games')
        .set('Authorization', `Bearer ${gamer.accessToken}`)
        .send({ move: 'rock' });
  
      expect(response.headers['content-type']).to.match(/json/);
      expect(response.status).to.equal(200);

      const game = response.body;

      ['_id',  'opponentId', 'challengerId'].forEach(prop => {
        expect(game).to.have.property(prop);
      });

      expect(game.type).to.equal(GameType.PVC);
      expect(game.status).to.be.oneOf(Object.values(GameStatus));
    });
  });
});
