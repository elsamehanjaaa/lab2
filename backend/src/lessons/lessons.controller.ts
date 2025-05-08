import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }
  @Post('getLessonsByCourse')
  async getLessonsByCourseId(
    @Body() body: { course_id: string; user_id: string },
  ) {
    return this.lessonsService.getLessonsByCourseId(
      body.course_id,
      body.user_id,
    );
  }
  @Post('getLessonsBySection')
  async getLessonsBySectionId(
    @Body() body: { section_id: string; user_id: string },
  ) {
    return this.lessonsService.getLessonsBySectionId(
      body.section_id,
      body.user_id,
    );
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
  //   return this.lessonsService.update(id, updateLessonDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
