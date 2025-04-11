import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/jwt-strategy/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Create a new course
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Req() request: Request,
  ) {
    if (!request.user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const { id } = request.user as any; // Adjust according to your user structure

    return this.coursesService.create(createCourseDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getCoursesByInstructor')
  getCoursesByInstructor(@Req() request: Request) {
    if (!request.user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const { id } = request.user as any;
    return this.coursesService.getCoursesByInstructor(id);
  }

  // Get all courses
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  // Get a course by its ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const course = await this.coursesService.findOne(id);

    if (!course) {
      throw new NotFoundException(`Course with ID '${id}' not found`);
    }

    return course;
  }

  @Post('GetCoursesByQuery')
  async getCoursesByQuery(@Body() body: { query: string }) {
    const { query } = body;
    return this.coursesService.getCoursesByQuery(query);
  }

  // Get filtered courses by query, rating, category, and price range
  @Post('getFilteredCourses')
  async getFilteredCourses(
    @Body()
    body: {
      query: string;
      rating?: number;
      categoryId?: string;
      startPrice?: number;
      endPrice?: number;
    },
  ) {
    const { query, rating, categoryId, startPrice, endPrice } = body;
    return this.coursesService.getFilteredCourses(
      query,
      rating,
      categoryId,
      startPrice,
      endPrice,
    );
  }

  // Update a course by its ID
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  // Remove a course by its ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
