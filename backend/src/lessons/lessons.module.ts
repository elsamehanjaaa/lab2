import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lessons, LessonsSchema } from 'src/schemas/lessons.schema';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { SupabaseService } from 'src/supabase/supabase.service'; // Import SupabaseService
import { CoursesModule } from 'src/courses/courses.module'; // Import CoursesModule for CoursesModel
import { ProgressModule } from 'src/progress/progress.module';
import { SectionService } from 'src/section/section.service';
import { SectionModule } from 'src/section/section.module';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { ProgressService } from 'src/progress/progress.service';
import { Progress, ProgressSchema } from 'src/schemas/progress.schema';
import { UploadService } from 'src/upload/upload.service';
import { R2Service } from 'src/r2/r2.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lessons.name, schema: LessonsSchema }]), // For LessonsModel
    MongooseModule.forFeature([
      { name: Progress.name, schema: ProgressSchema },
    ]), // Explicitly import for ProgressModel
    forwardRef(() => CoursesModule),
    forwardRef(() => ProgressModule),
    forwardRef(() => SectionModule),
    forwardRef(() => EnrollmentsModule),
  ],
  controllers: [LessonsController],
  providers: [
    LessonsService,
    SupabaseService,
    UploadService,
    R2Service,
    MongooseService,
    ProgressService,
  ],
  exports: [LessonsService, MongooseModule],
})
export class LessonsModule {}
