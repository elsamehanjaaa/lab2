import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { MongooseModule } from '@nestjs/mongoose'; // ✅ Import MongooseModule
import { EnrollmentsController } from './enrollments.controller';
import { Enrollments, EnrollmentsSchema } from '../schemas/enrollments.schema';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CoursesModule } from 'src/courses/courses.module'; // ✅

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enrollments.name, schema: EnrollmentsSchema },
    ]),
    forwardRef(() => CoursesModule),
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, SupabaseService, MongooseService],
  exports: [EnrollmentsService, MongooseModule],
})
export class EnrollmentsModule {}
