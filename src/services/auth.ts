import passport from "passport";
import { Express } from "express";
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import logger from "../utils/logger";
import { DbService } from "./db";

export class AuthService {

  static readonly dbService = new DbService();

  constructor() {}

  static init(app: Express) {
    passport.use(new BearerStrategy(async (accessToken, done) => {
      try {
        const [user] = await AuthService.dbService.find({ accessToken });
        if(!user) return done(null, false);

        return done(null, user);

      } catch(error) {
        logger.error(error);
        done(error);
      }
    }));

    app.use(passport.initialize());
  }

  static authenticate() {
    return passport.authenticate('bearer', { session: false });
  }
}