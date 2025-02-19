import { GameActorTypes } from "./GameActorTypes.enum";

export type MoveAction = {
  type: "move";
  oldPlace: string;
  newPlace: string;
} | null;
export type SwapAction = {
  type: "swap";
  place1: string;
  place2: string;
} | null;
export type UpgradeAction = {
  type: "upgrade";
  toType: GameActorTypes;
} | null;

export type GameTurnActions = [MoveAction, SwapAction, UpgradeAction];
