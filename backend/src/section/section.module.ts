import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { Section, SectionSchema } from 'src/schemas/section.schema';
import { SupabaseService } from 'src/supabase/supabase.service'; // Make sure to import SupabaseService
import { MongooseService } from 'src/mongoose/mongoose.service';
import { CoursesModule } from 'src/courses/courses.module'; // If CoursesModule is used
import { LessonsModule } from 'src/lessons/lessons.module';
import { LessonsService } from 'src/lessons/lessons.service';
import { ProgressService } from 'src/progress/progress.service';
import { ProgressModule } from 'src/progress/progress.module';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';
import { UploadService } from 'src/upload/upload.service';
import { R2Service } from 'src/r2/r2.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Section.name, schema: SectionSchema }]),
    forwardRef(() => CoursesModule),
    forwardRef(() => LessonsModule),
    forwardRef(() => ProgressModule),
    forwardRef(() => EnrollmentsModule),
  ],
  controllers: [SectionController],
  providers: [
    SectionService,
    SupabaseService,
    MongooseService,
    UploadService,
    R2Service,
    LessonsService,
    ProgressService,
  ],
  exports: [SectionService, MongooseModule], // ✅ Must export
})
export class SectionModule {}
