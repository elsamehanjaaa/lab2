import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Categories, CategoriesSchema } from '../schemas/categories.schema';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: Categories.name, schema: CategoriesSchema }]),
    ],
  controllers: [CategoriesController],
  providers: [CategoriesService, SupabaseService, MongooseService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
