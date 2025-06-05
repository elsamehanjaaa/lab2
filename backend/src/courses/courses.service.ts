import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { SectionService } from 'src/section/section.service';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Courses } from '../schemas/courses.schema';
import { Categories } from '../schemas/categories.schema'; // Import the Categories model
import { Enrollments } from 'src/schemas/enrollments.schema';
import { Section } from 'src/schemas/section.schema';
import { LessonsService } from 'src/lessons/lessons.service';
import { ProgressService } from 'src/progress/progress.service';
import { CourseDetailsService } from 'src/course_details/course_details.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CourseDetails } from 'src/schemas/course_details.schema';
import { Lessons } from 'src/schemas/lessons.schema';

@Injectable()
export class CoursesService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    private readonly sectionService: SectionService,
    private readonly lessonsService: LessonsService,
    private readonly progressService: ProgressService,
    private readonly courseDetailsService: CourseDetailsService,
    private readonly categoriesService: CategoriesService,
    @InjectModel(Courses.name) private readonly CoursesModel: Model<Courses>, // Inject Courses model
    @InjectModel(Categories.name)
    private readonly CategoriesModel: Model<Categories>,
    @InjectModel(Enrollments.name)
    private readonly EnrollmetsModel: Model<Enrollments>, // Inject Categories model
    @InjectModel(CourseDetails.name)
    private readonly CourseDetailsModel: Model<CourseDetails>, // Inject Categories model
    @InjectModel(Section.name)
    private readonly SectionModel: Model<Section>, // Inject Categories model
    @InjectModel(Lessons.name)
    private readonly LessonsModel: Model<Lessons>, // Inject Categories model
  ) {}

  // Create a new course
  async create(
    createCourseDto: CreateCourseDto,
    sections: any[],
    user_id: string,
    courseDetailsData: {
      description: string;
      learn: string[];
      requirements: string[];
    },
  ) {
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

    await this.courseDetailsService.create({
      course_id: data[0].id,
      ...courseDetailsData,
    });
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

  async getCoursesByQuery(query: string): Promise<Courses[]> {
    try {
      const courseIds = new Set<string>();

      const [
        directCourseMatches,
        categoryMatches,
        courseDetailResults,
        lessonMatches,
        sectionTitleMatches,
      ] = await Promise.all([
        this.CoursesModel.find(
          {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
            ],
          },
          '_id',
        ).exec(),
        this.CategoriesModel.find({
          name: { $regex: query, $options: 'i' },
        }).exec(),
        this.CourseDetailsModel.find(
          {
            $or: [
              { description: { $regex: query, $options: 'i' } },
              { learn: { $regex: query, $options: 'i' } },
              { requirements: { $regex: query, $options: 'i' } },
            ],
          },
          'course_id',
        ).exec(),
        this.LessonsModel.find(
          { title: { $regex: query, $options: 'i' } },
          'section_id',
        ).exec(),
        this.SectionModel.find(
          { title: { $regex: query, $options: 'i' } },
          'course_id',
        ).exec(),
      ]);

      directCourseMatches.forEach((course) =>
        courseIds.add(course._id.toString()),
      );

      if (categoryMatches.length > 0) {
        const matchedCategoryIds = categoryMatches.map((cat) => cat._id);
        const coursesInMatchedCategories = await this.CoursesModel.find(
          { categories: { $in: matchedCategoryIds } },
          '_id',
        ).exec();
        coursesInMatchedCategories.forEach((course) =>
          courseIds.add(course._id.toString()),
        );
      }

      courseDetailResults.forEach((detail) => {
        if (detail._id) courseIds.add(detail._id.toString());
      });

      sectionTitleMatches.forEach((section) => {
        if (section.course_id) courseIds.add(section.course_id.toString());
      });

      const lessonProcessingPromises = lessonMatches.map(async (lesson) => {
        if (!lesson.section_id) return;

        const section = await this.SectionModel.findOne(
          { _id: lesson.section_id },
          'course_id',
        ).exec();

        if (section && section.course_id) {
          courseIds.add(section.course_id.toString());
        }
      });
      await Promise.all(lessonProcessingPromises);

      if (courseIds.size === 0) {
        return [];
      }

      const finalCourses = await this.CoursesModel.find({
        _id: { $in: Array.from(courseIds) },
      }).exec();

      return finalCourses;
    } catch (error) {
      console.error('Error in getCoursesByQuery:', error);
      throw new Error(
        'Error fetching courses by comprehensive query. ' +
          (error instanceof Error ? error.message : String(error)),
      );
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

      // Build a Mongoose query object
      const filter: any = {};

      // If query is provided, get matching course IDs from getCoursesByQuery
      let courseIds: string[] | undefined = undefined;
      if (searchQuery) {
        const matchedCourses = await this.getCoursesByQuery(searchQuery);
        courseIds = matchedCourses.map((course) => course._id.toString());
        if (courseIds.length > 0) {
          filter._id = { $in: courseIds };
        } else {
          // If no courses match the query, return empty array early
          return [];
        }
      }

      if (rating) {
        filter.rating = rating;
      }

      if (categoryId) {
        filter.categories = { $in: [categoryId] };
      }

      if (
        startPrice !== undefined &&
        endPrice !== undefined &&
        typeof startPrice === 'number' &&
        typeof endPrice === 'number'
      ) {
        filter.price = { $gte: startPrice, $lte: endPrice };
      }

      const courses = await this.CoursesModel.find(filter).lean().exec(); // returns plain objects

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
    const course = await this.mongooseService.getDataById<Courses>(
      this.CoursesModel,
      id,
    );
    if (!course) return [];

    const auth = await this.supabaseService.auth();
    const user = await auth.admin.getUserById(
      (course as Courses).instructor_id,
    );

    const { instructor_id, categories, ...courseWithoutInstructorId } =
      course.toObject();

    const fetchedCategories = await Promise.all(
      course.categories.map(async (id) => {
        const category = await this.categoriesService.findOne(id.toString());
        return {
          id: category?._id,
          name: category?.name,
          slug: category?.slug,
        };
      }),
    );

    const details = await this.courseDetailsService.findOne(id);
    courseWithoutInstructorId.categories = fetchedCategories;
    courseWithoutInstructorId.learn = details?.learn;
    courseWithoutInstructorId.requirements = details?.requirements;
    courseWithoutInstructorId.fullDescription = details?.description;
    courseWithoutInstructorId.instructor_name =
      user.data.user?.user_metadata.full_name || 'Unknown';

    return courseWithoutInstructorId;
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
  async update(id: string, updateCourseDto: UpdateCourseDto, sections: any[]) {
    // Update slug
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\-]/g, '')
        .trim();
    };
    const { requirements, fullDescription, learn, ...coursedata } =
      updateCourseDto;
    if (coursedata.title) {
      coursedata.slug = generateSlug(coursedata.title);
    }

    const { data, error } = await this.supabaseService.updateData(
      'courses',
      coursedata,
      id,
    );
    if (error) {
      console.error('Error updating Supabase data:', error);
      throw error;
    }

    // Update in MongoDB
    const mongo = await this.mongooseService.updateData(this.CoursesModel, id, {
      ...coursedata,
      categories: (coursedata.categories ?? []).map((category) =>
        parseInt(category, 10),
      ),
    });
    if (!mongo) {
      throw Error('Error updating data in MongoDB');
    }
    if (coursedata.sections) {
      // Update sections and lessons
      const existingSections =
        await this.sectionService.getSectionsByCourseId(id);

      const sectionPromises = sections.map(async (sectionDto) => {
        let section = existingSections.find((s) => s._id === sectionDto._id);

        // Create if not exists
        if (!section) {
          const created = await this.sectionService.create({
            title: sectionDto.title,
            index: sectionDto.id,
            course_id: sectionDto.course_id,
          });
          section = created[0];
        } else {
          // Update if exists
          const updatedSection = await this.sectionService.update(section._id, {
            title: sectionDto.title,
            index: sectionDto.index,
          });
        }

        if (!section) {
          throw new Error('Section not found');
        }
        const existingLessons = await this.lessonsService.getLessonsBySectionId(
          section.id,
          coursedata.instructor_id || '',
        );

        const lessonPromises = sectionDto.lessons.map(async (lessonDto) => {
          let lesson = existingLessons.find((l) => l._id === lessonDto._id);

          const baseLesson = {
            title: lessonDto.title,
            content: lessonDto.content || '',
            video_url: lessonDto.video_url,
            duration: lessonDto.duration,
            section_id: section.id,
            type: lessonDto.type,
            index: lessonDto.id || lessonDto.index,
            ...(lessonDto.url && { url: lessonDto.url }),
          };

          if (!lesson) {
            const createdLesson = await this.lessonsService.create(baseLesson);

            const enrolledUsers = await this.EnrollmetsModel.find({
              course_id: id,
            }).select('user_id');

            const user_ids = enrolledUsers.map((user) => {
              return user.user_id;
            });

            const progressPromises = user_ids.map(async (id) => {
              await this.progressService.createOne(id, createdLesson[0].id);
            });
            await Promise.all(progressPromises);
          } else {
            await this.lessonsService.update(lesson._id, baseLesson);
          }
        });

        await Promise.all(lessonPromises);
      });

      await Promise.all(sectionPromises);
    }

    await this.courseDetailsService.update(id, {
      description: fullDescription,
      learn,
      requirements,
    });

    return { message: 'Course updated successfully' };
  }
  async remove(id: string) {
    try {
      // Find courses with the exact instructor_id
      await this.sectionService.removeByCourse(id);

      await this.courseDetailsService.remove(id);

      await this.supabaseService.deleteData('courses', id);

      await this.mongooseService.deleteData(this.CoursesModel, id);
    } catch (error) {
      throw new Error('Error fetching courses: ' + error.message);
    }
  }
}
