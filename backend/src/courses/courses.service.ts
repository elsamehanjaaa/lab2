import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Courses } from '../schemas/courses.schema';
import { Categories } from '../schemas/categories.schema'; // Import the Categories model

@Injectable()
export class CoursesService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    @InjectModel(Courses.name) private readonly CoursesModel: Model<Courses>,
    @InjectModel(Categories.name)
    private readonly CategoriesModel: Model<Categories>, // Inject Categories model
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const { data, error } = await this.supabaseService.insertData(
      'courses',
      createCourseDto,
    );
    if (error) {
      console.error('Error inserting data:', error);
      throw error;
    }

    let categories: Types.ObjectId[] = [];
    if (createCourseDto.categories && createCourseDto.categories.length > 0) {
      const categoryIds = createCourseDto.categories;

      const categoriesFromDb = (await this.CategoriesModel.find(
        { categoryId: { $in: categoryIds } },
        { _id: 1 },
      ).exec()) as { _id: Types.ObjectId }[];

      categories = categoriesFromDb.map((category) => category._id);
    }

    const mongo = await this.mongooseService.insertData(this.CoursesModel, {
      ...createCourseDto,
      categories: categories,
      courseId: data[0].id,
    });

    if (!mongo) {
      console.error('Error inserting data:', error);
      throw error;
    }

    return data;
  }

  async findAll() {
    return await this.mongooseService.getAllData(this.CoursesModel);
  }

  async getCoursesByCategory(categoryId: string): Promise<Courses[]> {
    try {
      console.log(categoryId);
      // Find courses that contain the given category ID in the categories array
      const courses = await this.CoursesModel.find({
        categories: { $in: [categoryId] },
      }).exec();
      return courses;
    } catch (error) {
      throw new Error('Error fetching courses: ' + error.message);
    }
  }

  async findOne(id: string) {
    return await this.CoursesModel.findOne({ courseId: id }).exec();
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
