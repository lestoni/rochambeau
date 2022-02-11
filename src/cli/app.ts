import inquirer from "inquirer";
import { GameController, UserController } from "../controllers";
import { GameStatus, GameType } from "../entities/game";
import { User } from "../entities/user";
import figlet from 'figlet';

import logger from "../utils/logger";

/**
 * Step 1: authentication - username and password
 * 
 */

class App {

  private readonly gameController = new GameController();
  private readonly userController = new UserController();
  private gameOpponent: string;
  private gameChallenger: User;

  constructor() {
    // disable logger for cli app
    logger.transports.forEach(transport => transport.silent = true);
  }

  async isAuthenticated(): Promise<boolean> {
    if(process.env.ROCHAMBEAU_ACCESS_TOKEN) {
      const gamer = await this.userController.getOne({
        accessToken: process.env.ROCHAMBEAU_ACCESS_TOKEN
      });
      if(gamer) {
        this.gameChallenger = gamer;
        return true
      };

      return false;
    }

    return false;
  }

  async play() {
    const isAuthenticated = await this.isAuthenticated();

    if(!isAuthenticated) { throw 'Missing AccessToken ' }

    const { opponentKind } = await inquirer.prompt([
      {
        name: 'opponentKind',
        type: 'checkbox',
        message: 'Select Your Opponent',
        default: 'computer',
        choices: [
          { name: 'Rochambeau', value: 'computer' },
          { name: 'Player', value: 'player' },
        ]
      }
    ]);

    this.gameOpponent = opponentKind[0]

    if(this.gameOpponent === 'player') {
      const player = await this.selectPlayerOpponent();
      if(!player) this.panic('You have not selected an opponent');

      this.gameOpponent = player;
    }

    await this.playOpponent();

  }

  async selectPlayerOpponent() {
    const gamers = await this.userController.getAll();

    const choices = gamers.map((gamer) => {
      const { username: name, _id: value } = gamer;
      return { name, value };
    });

    const { opponentPlayer } = await inquirer.prompt([
      {
        name: 'opponentPlayer',
        type: 'checkbox',
        message: 'Select Your Opponent',
        choices
      }
    ]);

    return opponentPlayer[0];
  }

  async playOpponent() {
    const { _id } = this.gameChallenger;

    const { gameMove } = await inquirer.prompt([
      {
        name: 'gameMove',
        type: 'checkbox',
        message: 'Select Your Game move',
        choices: [
          { name: 'Rock', value: 'rock' },
          { name: 'Paper', value: 'paper' },
          { name: 'Scissors', value: 'scissors' }
        ]
      }
    ]);

    let newGamePayload: any = {
      challengerId: _id,
      moves: gameMove
    };
    if(this.gameOpponent !== 'computer') {
      newGamePayload = { ...newGamePayload, opponentId: this.gameOpponent };
    }

    let game = await this.gameController.create(_id, newGamePayload);

    let move = gameMove[0];
    if(game.type === GameType.PVC) {
      move = this.gameController.randomMove;
    }

    const { game: updatedGame, result } = await this.gameController.play(_id, game._id, {
      move,
    });

    this.print(`> Rombacheau plays ${move}!`);
    const { score } = await this.userController.updateScore(updatedGame);
    this.print(`> Your New Score: ${score}`);

    this.endGameMessage(result)
  }

  endGameMessage(result: GameStatus) {
    switch(result) {
      case GameStatus.WIN:
        this.print(figlet.textSync('Winner Winner Chicken Dinner!', 'Ghost'));
        break;
      case GameStatus.LOSE:
        this.print(figlet.textSync('You Lose!', 'Ghost'));
        break;
      case GameStatus.TIE:
        this.print(figlet.textSync('Good Game!', 'Ghost'));
        break;
    }
  }

  print(message) {
    console.log(message);
  }

  panic (message: string) {
    this.print(message);
    process.exit(1);
  }
}

const runner = async () => {
  try {
    const app = new App();

    await app.play();
  } catch (error) {
    console.log(error)
  }
};

runner();