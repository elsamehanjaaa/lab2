import { Module } from '@nestjs/common';
import { CourseDetailsService } from './course_details.service';
import { CourseDetailsController } from './course_details.controller';

@Module({
  controllers: [CourseDetailsController],
  providers: [CourseDetailsService],
})
export class CourseDetailsModule {}
