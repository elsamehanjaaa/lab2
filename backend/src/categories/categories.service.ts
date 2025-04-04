import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Categories } from '../schemas/categories.schema';

@Injectable()
export class CategoriesService {
  constructor(private readonly supabaseService: SupabaseService, private readonly mongooseService: MongooseService, @InjectModel(Categories.name) private readonly CategoriesModel: Model<Categories>,) {}
  
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    return await this.mongooseService.getAllData(this.CategoriesModel)
  }

  async findByName(name: string) {
    return await this.mongooseService.getDataByName(this.CategoriesModel, name);
  }
  
  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
