export class UpdateSessionDto {
  nextTurnForPlayer: "left" | "right";
  moveFrom: string;
  moveTo: string;
  turnDuration: number;
}
