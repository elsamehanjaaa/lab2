import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Create a new course
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
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

  // Get courses by category ID (old method)
  @Post('getCoursesByCategory')
  async getByName(@Body() body: any) {
    return this.coursesService.getCoursesByCategory(body.id);
  }
  @Post('createInstructor')
  async createInstructor(@Body() body: any) {
    return this.coursesService.createInstructor(body.id);
  }

  @Post('getCoursesByRating')
  async getByCategory(@Body() body : {rating : number}) {
    return this.coursesService.getCoursesByRating(body.rating);
  }

  @Post('GetCoursesByQuery')
  async getCoursesByQuery(@Body() body: any) {
    return this.coursesService.getCoursesByQuery(body.query);
  }

  @Post('getCoursesByPriceRange')
  async getCoursesByPriceRange(@Body() body: { startPrice: number, endPrice: number }) {
    return this.coursesService.getCoursesByPriceRange(body.startPrice, body.endPrice);
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
