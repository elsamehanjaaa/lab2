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
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
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
  async getByName(@Body() getEnrollmentsByUserDto: any) {
    const { user_id } = getEnrollmentsByUserDto;
    return this.enrollmentsService.getEnrollmentsByUser(user_id);
  }
  @Post('check-access')
  @UseGuards(JwtAuthGuard)
  async checkAccess(@Req() req, @Body() body: any) {
    const userId = (req.user as any).id;

    if (!body || !body.course_id) {
      throw new BadRequestException('Missing course_id');
    }

    const access = await this.enrollmentsService.checkAccess(
      userId,
      body.course_id,
    );

    return access;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(id);
  }
}
