import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { MongooseModule } from '@nestjs/mongoose'; // ✅ Import MongooseModule
import { EnrollmentsController } from './enrollments.controller';
import { Enrollments, EnrollmentsSchema } from '../schemas/enrollments.schema';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CoursesModule } from 'src/courses/courses.module'; // ✅
import { ProgressService } from 'src/progress/progress.service';
import { SectionService } from 'src/section/section.service';
import { LessonsService } from 'src/lessons/lessons.service';
import { ProgressModule } from 'src/progress/progress.module'; // Import ProgressModule
import { SectionModule } from 'src/section/section.module';
import { LessonsModule } from 'src/lessons/lessons.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enrollments.name, schema: EnrollmentsSchema },
    ]),
    forwardRef(() => CoursesModule),
    forwardRef(() => ProgressModule), // ← this must be present
    forwardRef(() => LessonsModule),
    forwardRef(() => SectionModule),
    forwardRef(() => EnrollmentsModule),
  ],
  controllers: [EnrollmentsController],
  providers: [
    EnrollmentsService, // only the things this module _owns_
    SupabaseService, // if you really need Supabase directly here
    MongooseService, // same for your wrapper
  ],
  exports: [EnrollmentsService, MongooseModule],
})
export class EnrollmentsModule {}
