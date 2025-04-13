import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { Section, SectionSchema } from 'src/schemas/section.schema';
import { SupabaseService } from 'src/supabase/supabase.service'; // Make sure to import SupabaseService
import { MongooseService } from 'src/mongoose/mongoose.service';
import { CoursesModule } from 'src/courses/courses.module'; // If CoursesModule is used

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Section.name, schema: SectionSchema }]),
    forwardRef(() => CoursesModule), // Handle circular dependency if needed
  ],
  controllers: [SectionController],
  providers: [
    SectionService,
    SupabaseService, // Add SupabaseService to providers if needed
    MongooseService,
  ],
  exports: [SectionService], // Export the SectionService if it's used in other modules
})
export class SectionModule {}
