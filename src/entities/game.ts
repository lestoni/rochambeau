export enum GameStatus {
  WIN = 'win',
  LOSE = 'lose',
  TIE = 'tie',
  NEW = 'new',
}

export enum GameMove {
  ROCK = 'rock',
  PAPER = 'paper',
  SCISSORS = 'scissors',
}

export enum GameType {
  PVC = 'player_vs_computer',
  PVP = 'player_vs_player',
}

const Rochambeau = 'computer';

export class Game {
  public _id: string;
  public challenger: string;
  public opponent: string;
  public moves: GameMove[];
  public status: GameStatus = GameStatus.NEW;
  public type: GameType;

  constructor() {}

  static create(data: any): Game {
    const { challenger, opponent, moves, _id, type } = data;

    const instance = new Game();

    instance._id = _id;
    instance.challenger = challenger;
    instance.moves = moves || [];
    instance.opponent = opponent || Rochambeau;
    instance.type = type || GameType.PVC;

    return instance;
  }
}