import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // ✅ Import MongooseModule
import { CoursesService } from './courses.service';

import { CoursesController } from './courses.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Courses, CoursesSchema } from '../schemas/courses.schema'; // ✅ Import Course Schema
import { MongooseService } from 'src/mongoose/mongoose.service';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    CategoriesModule,
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]), // ✅ Register Course model
  ],
  controllers: [CoursesController],
  providers: [CoursesService, SupabaseService, MongooseService],
  exports: [CoursesService],
})
export class CoursesModule {}