import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Teachers, TeachersSchema } from 'src/schemas/teachers.schema';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CoursesModule } from 'src/courses/courses.module';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Teachers.name, schema: TeachersSchema },
    ]),
    CoursesModule,
    EnrollmentsModule,
  ],
  controllers: [TeachersController],
  providers: [TeachersService, SupabaseService, MongooseService],
})
export class TeachersModule {}
