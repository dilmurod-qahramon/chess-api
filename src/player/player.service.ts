<<<<<<< HEAD
// import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/sequelize";
// import { Player } from "src/models/player.model";
=======
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Player } from "src/models/player.model";
>>>>>>> def20f5fea83b3ca3d199ac37e74324c6a5346ff

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

<<<<<<< HEAD
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
=======
  async findAll(): Promise<Player[]> {
    return this.playerModel.findAll();
  }

  findOne(id: number): Promise<Player | null> {
    // return this.userModel.findByPk(id);
    return this.playerModel.findOne({
      where: {
        id,
      },
    });
  }
>>>>>>> def20f5fea83b3ca3d199ac37e74324c6a5346ff

//   async remove(id: number) {
//     const user = await this.findOne(id);
//     await user?.destroy();
//   }
// }
