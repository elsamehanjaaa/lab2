import { Module } from '@nestjs/common';
import { CourseDetailsService } from './course_details.service';
import { CourseDetailsController } from './course_details.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CourseDetailsSchema,
  CourseDetails,
} from 'src/schemas/course_details.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseDetails.name, schema: CourseDetailsSchema },
    ]),
  ],
  controllers: [CourseDetailsController],
  providers: [CourseDetailsService, SupabaseService, MongooseService],
  exports: [CourseDetailsService, MongooseModule],
})
export class CourseDetailsModule { }
