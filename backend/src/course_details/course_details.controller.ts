import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { CourseDetailsService } from './course_details.service';
import { CreateCourseDetailDto } from './dto/create-course_detail.dto';
import { UpdateCourseDetailDto } from './dto/update-course_detail.dto';
import { JwtAuthGuard } from 'src/jwt-strategy/jwt-auth.guard';

@Controller('course-details')
export class CourseDetailsController {
  constructor(private readonly courseDetailsService: CourseDetailsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCourseDetailDto: CreateCourseDetailDto, @Req() request: Request) {
    if (!request.user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return this.courseDetailsService.create(createCourseDetailDto);
  }

  @Get()
  findAll() {
    return this.courseDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseDetailsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDetailDto: UpdateCourseDetailDto,
  ) {
    return this.courseDetailsService.update(id, updateCourseDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseDetailsService.remove(id);
  }
}
