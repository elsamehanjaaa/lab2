import { forwardRef, Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseModule } from '@nestjs/mongoose'; // ✅ Import MongooseModule
import { Progress, ProgressSchema } from 'src/schemas/progress.schema';
import { LessonsModule } from 'src/lessons/lessons.module';
import { SectionService } from 'src/section/section.service';
import { LessonsService } from 'src/lessons/lessons.service';
import { SectionModule } from 'src/section/section.module';
import { CoursesModule } from 'src/courses/courses.module';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Progress.name, schema: ProgressSchema },
    ]),
    forwardRef(() => LessonsModule),
    forwardRef(() => SectionModule),
    forwardRef(() => CoursesModule),
    forwardRef(() => EnrollmentsModule),
  ],
  controllers: [ProgressController],
  providers: [
    ProgressService,
    SupabaseService,
    MongooseService,
    SectionService,
    // ← do NOT re-provide LessonsService, EnrollmentsService, etc.
  ],
  exports: [
    ProgressService, // ← make sure this is here
    MongooseModule, // ← so that the ProgressModel token is shared
  ],
})
export class ProgressModule {}
