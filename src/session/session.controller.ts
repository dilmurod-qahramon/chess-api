import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SessionService } from "./session.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { UUID } from "crypto";

@Controller("session")
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async create(@Body() createSessionDto: CreateSessionDto) {
    return await this.sessionService.create(createSessionDto);
  }

  @Get()
  async getAll() {
    return await this.sessionService.findAll();
  }

  @Get(":id")
  async getById(@Param("id") id: UUID) {
    return await this.sessionService.findById(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: UUID,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return await this.sessionService.update(id, updateSessionDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: UUID) {
    return await this.sessionService.remove(id);
  }
}
