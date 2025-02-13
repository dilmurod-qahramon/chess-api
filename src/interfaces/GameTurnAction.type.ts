import { GameActorTypes } from "./GameActorTypes.enum";

export type MoveAction = {
  type: "move";
  oldPlace: [];
  newPlace: [];
} | null;
export type SwapAction = {
  type: "swap";
  place1: [];
  place2: [];
} | null;
export type UpgradeAction = {
  type: "upgrade";
  place: [];
  toType: GameActorTypes;
} | null;

export type GameTurnActions = [MoveAction, SwapAction, UpgradeAction];
