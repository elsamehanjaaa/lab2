import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { GetEnrollmentsByUserDto } from './dto/get-enrollemnt-by-user.dto';
import { JwtAuthGuard } from 'src/jwt-strategy/jwt-auth.guard';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return await this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Post('getEnrollmentsByUser')
  @UseGuards(JwtAuthGuard)
  async getByName(@Body() getEnrollmentsByUserDto: any) {
    const { user_id } = getEnrollmentsByUserDto;
    return this.enrollmentsService.getEnrollmentsByUser(user_id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(id);
  }
}
