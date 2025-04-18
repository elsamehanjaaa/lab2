import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { SectionService } from 'src/section/section.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Courses } from '../schemas/courses.schema';
import { Categories } from '../schemas/categories.schema'; // Import the Categories model
import { Enrollments } from 'src/schemas/enrollments.schema';
import { LessonsService } from 'src/lessons/lessons.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    private readonly sectionService: SectionService,
    private readonly lessonsService: LessonsService,
    @InjectModel(Courses.name) private readonly CoursesModel: Model<Courses>, // Inject Courses model
    @InjectModel(Categories.name)
    private readonly CategoriesModel: Model<Categories>,
    @InjectModel(Enrollments.name)
    private readonly EnrollmetsModel: Model<Enrollments>, // Inject Categories model
  ) {}

  // Create a new course
  async create(createCourseDto: CreateCourseDto, sections: any[]) {
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
    // Insert course into Supabase
    const { data, error } = await this.supabaseService.insertData(
      'courses',
      createCourseDto,
    );
    if (error) {
      console.error('Error inserting data:', error);
      throw error;
    }
    // Insert course into MongoDB
    const mongo = await this.mongooseService.insertData(this.CoursesModel, {
      ...createCourseDto,
      categories: createCourseDto.categories.map((category) =>
        parseInt(category, 10),
      ),
      _id: data[0].id,
    });
    if (!mongo) {
      throw Error('Error inserting data into MongoDB ');
    }

    const createSectionsPromises = sections.map(async (s) => {
      const section = await this.sectionService.create({
        title: s.title,
        index: s.id,
        course_id: data[0].id,
      });
      return section[0]; // You can return the section or any result if needed
    });
    const insertedSections = await Promise.all(createSectionsPromises);
    const createLessonsPromises = sections.map(async (s) => {
      s.lessons.map(async (l) => {
        const section = insertedSections.find(
          (section) => section.index === s.id,
        );
        const lesson = await this.lessonsService.create({
          title: l.title,
          content: l.content || '',
          video_url: l.video_url,
          duration: l.duration,
          index: l.id,
          section_id: section.id,
          url: l.url,
          type: l.type,
        });
        return lesson;
      });
    });
    // Wait for all async operations to complete
    await Promise.all(createLessonsPromises);
    return data;
  }

  // Get all courses
  async findAll() {
    return await this.mongooseService.getAllData(this.CoursesModel);
  }

  // Create an instructor
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
      // Find courses that contain the given category ID in the categories array
      const courses = await this.CoursesModel.find({
        categories: { $in: [categoryId] },
      }).exec();
      return courses;
    } catch (error) {
      throw new Error('Error fetching courses: ' + error.message);
    }
  }

  // Get courses by rating
  async getCoursesByRating(rating: number): Promise<Courses[]> {
    try {
      const courses = await this.CoursesModel.find({ rating }).exec();
      return courses;
    } catch (error) {
      throw new Error('Error fetching courses: ' + error.message);
    }
  }

  // Get courses by search query
  async getCoursesByQuery(query: string): Promise<Courses[]> {
    try {
      const courses = await this.CoursesModel.find({
        title: { $regex: query, $options: 'i' }, // 'i' makes the search case-insensitive
      }).exec();
      return courses;
    } catch (error) {
      throw new Error('Error fetching courses: ' + error.message);
    }
  }

  // Search courses by category name
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

  // Get courses by price range
  async getCoursesByPriceRange(
    startPrice: number,
    endPrice: number,
  ): Promise<Courses[]> {
    try {
      console.log(
        `Fetching courses with price range: ${startPrice} to ${endPrice}`,
      );
      const courses = await this.CoursesModel.find({
        price: { $gte: startPrice, $lte: endPrice },
      }).exec();
      return courses;
    } catch (error) {
      console.error('Error fetching courses by price range:', error);
      throw new Error(
        'Error fetching courses by price range: ' + error.message,
      );
    }
  }

  // Get filtered courses by query, rating, category, and price range
  async getFilteredCourses(
    query: string,
    rating?: number,
    categoryId?: string,
    startPrice?: number,
    endPrice?: number,
  ) {
    try {
      const searchQuery = typeof query === 'string' ? query : '';

      let coursesQuery = this.CoursesModel.find({
        title: { $regex: searchQuery, $options: 'i' },
      });

      if (rating) {
        coursesQuery = coursesQuery.where('rating').equals(rating);
      }

      if (categoryId) {
        coursesQuery = coursesQuery.where('categories').in([categoryId]);
      }

      if (
        startPrice !== undefined &&
        endPrice !== undefined &&
        typeof startPrice === 'number' &&
        typeof endPrice === 'number'
      ) {
        coursesQuery = coursesQuery
          .where('price')
          .gte(startPrice)
          .lte(endPrice);
      }

      const courses = await coursesQuery.lean().exec(); // returns plain objects

      const coursesWithCounts = await Promise.all(
        courses.map(async (course) => {
          const enrollments = await this.EnrollmetsModel.countDocuments({
            course_id: course._id,
          });
          return {
            ...course, // no toObject() needed
            enrollments,
          };
        }),
      );

      return coursesWithCounts;
    } catch (error) {
      throw new Error('Error fetching filtered courses: ' + error.message);
    }
  }

  // Get a course by ID
  async findOne(id: string) {
    return await this.CoursesModel.findOne({ _id: id }).exec();
  }
  async getCoursesByInstructor(instructor_id: string): Promise<Courses[]> {
    try {
      // Find courses with the exact instructor_id
      const courses = await this.CoursesModel.find({
        instructor_id,
      }).exec();
      return courses;
    } catch (error) {
      throw new Error('Error fetching courses: ' + error.message);
    }
  }
  // Update a course
  async update(id: string, updateCourseDto: UpdateCourseDto) {
    //   const { data, error } = await this.supabaseService.updateData(
    //     'courses',
    //     updateCourseDto,
    //     id,
    //   );
    //   if (error) {
    //     console.error('Error inserting data:', error);
    //     throw error;
    //   }
    //   const mongo = await this.mongooseService.updateData(this.CoursesModel, id, {
    //     ...updateCourseDto,
    //     categories: updateCourseDto.categories,
    //   });
    //   if (!mongo) {
    //     throw Error('Error inserting data into MongoDB');
    //   }
    // }
    // // Remove a course
    // async remove(id: string) {
    //   await this.supabaseService.deleteData('courses', id.toString());
    //   await this.mongooseService.deleteData(this.CoursesModel, id.toString());
    //   return { message: 'Course deleted successfully' };
  }
}
