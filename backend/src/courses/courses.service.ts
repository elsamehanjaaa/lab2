// src/courses/courses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Courses } from '../schemas/courses.schema';
import { Categories } from '../schemas/categories.schema'; // Import the Categories model

@Injectable()
export class CoursesService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    @InjectModel(Courses.name) private readonly CoursesModel: Model<Courses>, // Inject Courses model
    @InjectModel(Categories.name)
    private readonly CategoriesModel: Model<Categories>, // Inject Categories model
  ) {}

  // Create a new course
  async create(createCourseDto: CreateCourseDto) {
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase() // Make the title lowercase
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/&/g, 'and') // Replace "&" with "and"
        .replace(/[^a-z0-9\-]/g, '') // Remove any characters that are not letters, numbers, or dashes
        .trim(); // Trim any leading/trailing spaces
    };

    // Generate the slug

    createCourseDto.slug = generateSlug(createCourseDto.title);
    const { data, error } = await this.supabaseService.insertData(
      'courses',
      createCourseDto,
    );
    if (error) {
      console.error('Error inserting data:', error);
      throw error;
    }

    const mongo = await this.mongooseService.insertData(this.CoursesModel, {
      ...createCourseDto,
      categories: createCourseDto.categories,
      _id: data[0].id,
    });

    if (!mongo) {
      throw Error('Error inserting data into MongoDB');
    }

    return data;
  }

  // Get all courses
  async findAll() {
    return await this.mongooseService.getAllData(this.CoursesModel);
  }

  async createInstructor(user_id: string) {
    const { data, error } = await (
      await this.supabaseService.auth()
    ).admin.updateUserById(user_id, {
      app_metadata: { role: 'instructor' },
    });
    return data;
  }
  // Get courses by category ID (old method)
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

  async getCoursesByQuery(query: string): Promise<Courses[]> {
    try {
      console.log(query);
      const courses = await this.CoursesModel.find({
        title: { $regex: query, $options: 'i' }, // 'i' makes the search case-insensitive
      }).exec();
      return courses;
    } catch (error) {
      throw new Error('Error fetching courses: ' + error.message);
    }
  }

  async searchCoursesByCategoryName(categoryName: string): Promise<Courses[]> {
    if (!categoryName) {
      throw new Error('Category name must be provided');
    }

    try {
      // Find category by name
      const category = await this.CategoriesModel.findOne({
        name: categoryName,
      }).exec();

      if (!category) {
        throw new Error(`Category "${categoryName}" not found`);
      }

      // Get courses that belong to this category ID
      const courses = await this.CoursesModel.find({
        categories: { $in: [category._id] },
      }).exec();

      return courses;
    } catch (error) {
      throw new Error('Error fetching courses: ' + error.message);
    }
  }

  // Get a course by ID
  async findOne(id: string) {
    return await this.CoursesModel.findOne({ _id: id }).exec();
  }

  // Update a course
  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const { data, error } = await this.supabaseService.updateData(
      'courses',
      updateCourseDto,
      id,
    );
    if (error) {
      console.error('Error inserting data:', error);
      throw error;
    }

    const mongo = await this.mongooseService.updateData(this.CoursesModel, id, {
      ...updateCourseDto,
      categories: updateCourseDto.categories,
    });

    if (!mongo) {
      throw Error('Error inserting data into MongoDB');
    }
  }

  // Remove a course
  async remove(id: string) {
    await this.supabaseService.deleteData('courses', id.toString());
    await this.mongooseService.deleteData(this.CoursesModel, id.toString());

    return { message: 'Course deleted successfully' };
  }
}
