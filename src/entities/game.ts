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

export class Game {
  public id: string;
  public challenger: string;
  public opponent: string = 'computer';
  public moves: GameMove[] = [];
  public status: GameStatus = GameStatus.NEW;
  public type: GameType = GameType.PVC;

  constructor() {}

  static create(data: any): Game {
    const { challenger, opponent, moves, id } = data;

    const instance = new Game();

    instance.id = id;
    instance.challenger = challenger;
    instance.moves = moves;

    if(opponent) {
      instance.opponent = opponent;
      instance.type = GameType.PVP;
    }

    return instance;
  }
}