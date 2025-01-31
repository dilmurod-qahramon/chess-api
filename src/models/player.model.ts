import { Column, Table, Model, AutoIncrement } from "sequelize-typescript";

@Table
export class Player extends Model {
  @AutoIncrement
  @Column({ primaryKey: true })
  id: number;

  @Column
  player1: string;

  @Column
  player2: string;
}
