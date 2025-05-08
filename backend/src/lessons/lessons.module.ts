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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lessons.name, schema: LessonsSchema }]), // Ensure LessonsModel is registered here
    forwardRef(() => CoursesModule), // Handle circular dependency if needed
    forwardRef(() => ProgressModule), // Handle circular dependency if needed
    forwardRef(() => SectionModule), // Handle circular dependency if needed
  ],
  controllers: [LessonsController],
  providers: [LessonsService, SupabaseService, MongooseService, SectionService],
  exports: [MongooseModule], // ✅ Export MongooseModule to make LessonsModel available
})
export class LessonsModule {}
