// import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/sequelize";
// import { Player } from "src/models/player.model";

// @Injectable()
// export class PlayerService {
//   constructor(
//     @InjectModel(Player)
//     private readonly playerModel: typeof Player,
//   ) {}

//   async create(createPlayerDto: CreatePlayerDto) {
//     const player = new Player();
//     player.player1 = createPlayerDto.player1;
//     player.player2 = createPlayerDto.player2;
//     await player.save();
//     return player.id;
//   }

//   async findAll(): Promise<Player[]> {
//     return this.playerModel.findAll();
//   }

//   findOne(id: number): Promise<Player | null> {
//     // return this.userModel.findByPk(id);
//     return this.playerModel.findOne({
//       where: {
//         id,
//       },
//     });
//   }

//   async remove(id: number) {
//     const user = await this.findOne(id);
//     await user?.destroy();
//   }
// }
