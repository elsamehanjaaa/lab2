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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Request } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/jwt-strategy/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import * as fs from 'fs';
import * as path from 'path';
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly uploadService: UploadService,
  ) {}

  // Create a new course
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async createCourse(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('courseData') rawCourseData: string,
    @Req() request: Request,
  ) {
    const courseData = JSON.parse(rawCourseData);

    const { id } = request.user as any; // Adjust according to your user structure
    courseData.instructor_id = id;

    // Process files sequentially
    for (const file of files) {
      const thumbnail = file.fieldname.match('thumbnail');
      if (thumbnail) {
        try {
          const { url } = await this.uploadService.handleThumbnailUpload(
            file,
            courseData.title,
          );
          courseData.thumbnail_url = url;
        } catch (error) {
          console.error(error);
          // Optionally: Keep processing other files but mark this lesson as failed
        }
        continue;
      }
      const matches = file.fieldname.match(/videos\[(\d+)\]\[(\d+)\]/);
      if (!matches) continue;

      const sectionId = parseInt(matches[1]);
      const lessonId = parseInt(matches[2]);

      const section = courseData.sections.find((s: any) => s.id === sectionId);

      if (!section) {
        console.warn(`Section ${sectionId} not found`);
        continue;
      }

      const lesson = section.lessons.find((l: any) => l.id === lessonId);

      if (!lesson) {
        console.warn(`Lesson ${lessonId} not found in section ${sectionId}`);
        continue;
      }

      try {
        // Upload video and get metadata
        const { url, duration } = await this.uploadService.handleVideoUpload(
          file,
          courseData.title,
          lesson.title,
        );

        // Update lesson with video details
        lesson.video_url = url;
        lesson.duration = duration;

        // Clean up temporary file
      } catch (error) {
        console.error(`Failed to process video for lesson ${lessonId}:`, error);
        // Optionally: Keep processing other files but mark this lesson as failed
      }
    }
    const { sections, ...restCourseData } = courseData;

    const data = await this.coursesService.create(restCourseData, sections);
    // Save to database
    return {
      message: 'Course created successfully',
      data: courseData,
    };
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
  @Post('getCoursesByCategory')
  async getByName(@Body() body: any) {
    return this.coursesService.getCoursesByCategory(body.id);
  }
  @Post('createInstructor')
  async createInstructor(@Body() body: any) {
    return this.coursesService.createInstructor(body.id);
  }

  @Post('getCoursesByRating')
  async getByCategory(@Body() body: { rating: number }) {
    return this.coursesService.getCoursesByRating(body.rating);
  }
  @Post('GetCoursesByQuery')
  async getCoursesByQuery(@Body() body: { query: string }) {
    const { query } = body;
    return this.coursesService.getCoursesByQuery(query);
  }
  @Post('getCoursesByPriceRange')
  async getCoursesByPriceRange(
    @Body() body: { startPrice: number; endPrice: number },
  ) {
    return this.coursesService.getCoursesByPriceRange(
      body.startPrice,
      body.endPrice,
    );
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
    // return this.coursesService.remove(id);
  }
}
