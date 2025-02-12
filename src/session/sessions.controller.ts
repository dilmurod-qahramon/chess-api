import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SessionService } from "./services/session.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { UUID } from "crypto";

@Controller("sessions")
export class SessionsController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async create(@Body() createSessionDto: CreateSessionDto) {
    return await this.sessionService.create(createSessionDto);
  }

  @Get(":id")
  async getById(@Param("id") id: UUID) {
    return await this.sessionService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: UUID, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(id, updateSessionDto);
  }

  // @Delete(":id")
  // async delete(@Param("id") id: UUID) {
  //   return await this.sessionService.remove(id);
  // }
}
