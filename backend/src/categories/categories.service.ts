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
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    @InjectModel(Categories.name)
    private readonly CategoriesModel: Model<Categories>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const generateSlug = (name: string): string => {
      return name
        .toLowerCase() // Make the name lowercase
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/&/g, 'and') // Replace "&" with "and"
        .replace(/[^a-z0-9\-]/g, '') // Remove any characters that are not letters, numbers, or dashes
        .trim(); // Trim any leading/trailing spaces
    };

    // Generate the slug
    createCategoryDto.slug = generateSlug(createCategoryDto.name);
    const { data, error } = await this.supabaseService.insertData(
      'categories',
      createCategoryDto,
    );
    if (error) {
      console.error('Error inserting data:', error);
      throw error;
    }

    const mongo = await this.mongooseService.insertData(this.CategoriesModel, {
      ...createCategoryDto,
      _id: data[0].id,
    });

    if (!mongo) {
      console.error('Error inserting data:', error);
      throw error;
    }

    return data;
  }

  async findAll() {
    return await this.mongooseService.getAllData(this.CategoriesModel);
  }

  async findByName(slug: string) {
    return await this.mongooseService.getDataByName(this.CategoriesModel, slug);
  }

  async findOne(id: string) {
    return await this.mongooseService.getDataById(this.CategoriesModel, id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { data, error } = await this.supabaseService.updateData(
      'categories',
      updateCategoryDto,
      id,
    );
    if (error) {
      console.error('Error inserting data:', error);
      throw error;
    }

    const mongo = await this.mongooseService.updateData(
      this.CategoriesModel,
      id,
      updateCategoryDto,
    );

    if (!mongo) {
      throw Error('Error inserting data into MongoDB');
    }
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }
}
