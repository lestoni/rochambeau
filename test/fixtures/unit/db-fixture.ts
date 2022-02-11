import { randomUUID } from "crypto";
import { Game, GameType } from "../../../src/entities/game";

export const mockGame = Game.create({
  opponentId: 'e5e6ef7f-62b4-4de4-a34a-e4d639b40b5c',
  challengerId: 'a4e02e5d-6503-46ef-a41a-1dd4000eaede',
  type: GameType.PVP
});

export const mockGameDoc = mockGame._id = randomUUID();