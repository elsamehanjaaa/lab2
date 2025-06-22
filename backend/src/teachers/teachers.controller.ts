import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from 'src/jwt-strategy/jwt-auth.guard';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createTeacherDto: CreateTeacherDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return await this.teachersService.create(createTeacherDto, user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('checkUser')
  async checkUser(@Req() req: Request) {
    const user = req.user as any;

    return await this.teachersService.checkUser(user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('getData')
  async getData(@Req() req: Request) {
    const user = req.user as any;

    return await this.teachersService.getData(user.id);
  }

  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(+id, updateTeacherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(+id);
  }
}
