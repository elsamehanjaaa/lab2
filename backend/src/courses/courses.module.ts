import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Courses, CoursesSchema } from '../schemas/courses.schema';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';
import { SectionModule } from 'src/section/section.module';
import { LessonsModule } from 'src/lessons/lessons.module';
import { LessonsService } from 'src/lessons/lessons.service'; // Import LessonsService
import { UploadService } from 'src/upload/upload.service';
import { R2Service } from 'src/r2/r2.service';
import { ProgressModule } from 'src/progress/progress.module';
import { CourseDetailsService } from 'src/course_details/course_details.service';
import { CourseDetailsModule } from 'src/course_details/course_details.module';
import { SectionService } from 'src/section/section.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
    CategoriesModule,
    forwardRef(() => SectionModule),
    forwardRef(() => LessonsModule),
    forwardRef(() => ProgressModule),
    forwardRef(() => EnrollmentsModule),
    forwardRef(() => CourseDetailsModule),
  ],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    SupabaseService,
    MongooseService,
    CourseDetailsService,
    R2Service,
    UploadService, // Add LessonsService to providers
  ],
  exports: [
    CoursesService,
    MongooseModule, // ✅ Export MongooseModule to share CoursesModel
  ],
})
export class CoursesModule {}
