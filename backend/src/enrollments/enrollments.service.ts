import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { Model } from 'mongoose';
import { Enrollments, EnrollmentsSchema } from 'src/schemas/enrollments.schema';
import { Courses } from 'src/schemas/courses.schema';
import { ProgressService } from 'src/progress/progress.service';
import { LessonsService } from 'src/lessons/lessons.service';
import { Categories } from 'src/schemas/categories.schema';
interface EnrollmentRecord {
  _id: string; // The ID of the enrollment document itself
  course_id: string;
  user_id: string;
  progress: number; // e.g., percentage completion
  status: string; // e.g., 'Active', 'Completed', 'Pending'
  enrolled_at: Date | string; // Date of enrollment
  user: User; // Populated user detail
  // any other enrollment-specific fields you might have
}
interface User {
  id: string; // or _id if that's your primary user identifier
  name: string;
  email: string;
  // other user properties
}
@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    @Inject(forwardRef(() => LessonsService))
    private readonly lessonsService: LessonsService,

    @Inject(forwardRef(() => ProgressService))
    private readonly progressService: ProgressService, // This is the dependency at index 3
    @InjectModel(Enrollments.name)
    private readonly EnrollmentsModel: Model<Enrollments>,
    @InjectModel(Courses.name) private readonly CoursesModel: Model<Courses>,
    @InjectModel(Categories.name)
    private readonly CategoriesModel: Model<Categories>,
  ) {}
  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const { data, error } = await this.supabaseService.insertData(
      'enrollments',
      createEnrollmentDto,
    );

    if (error) {
      console.error('Error inserting data:', error);
      throw error;
    }
    const mongo = await this.mongooseService.insertData(this.EnrollmentsModel, {
      ...createEnrollmentDto,
      _id: data[0].id,
      enrolled_at: data[0].enrolled_at,
    });

    if (!mongo) {
      console.error('Error inserting data:', error);
      throw error;
    }
    await this.progressService.create({
      course_id: createEnrollmentDto.course_id,
      user_id: createEnrollmentDto.user_id,
    });
    return data;
  }

  async findAll() {
    return await this.mongooseService.getAllData(this.EnrollmentsModel);
  }

  async findOne(id: string) {
    return await this.mongooseService.getDataById(this.EnrollmentsModel, id);
  }
  async getEnrollmentsByUser(id: string) {
    // Fetch initial data
    const enrollments = await this.EnrollmentsModel.find({
      user_id: id,
      status: 'Active',
    });
    const courseIds = enrollments.map((e) => e.course_id);
    const courses = await this.CoursesModel.find({ _id: { $in: courseIds } });

    // --- NEW: Step 1: Collect all unique category IDs from all courses ---
    const allCategoryIds = courses.flatMap((course) => course.categories);
    const uniqueCategoryIds = [
      ...new Set(allCategoryIds.map((id) => id.toString())),
    ];

    // --- NEW: Step 2: Fetch all referenced categories in a single query ---
    const allCategories = await this.CategoriesModel.find({
      _id: { $in: uniqueCategoryIds },
    });

    // --- NEW: Step 3: Create a lookup map for efficient access ---
    // This prevents having to search the allCategories array for every single category
    const categoryMap = new Map(
      allCategories.map((category) => [category._id.toString(), category.name]),
    );

    // --- MODIFIED: Step 4: Attach progress AND populate category names ---
    // Use Promise.all to wait for every async operation inside the map to complete
    const coursesWithProgressAndCategories = await Promise.all(
      courses.map(async (course) => {
        // Find the corresponding enrollment to get the progress
        const enrollment = enrollments.find(
          (e) => e.course_id.toString() === course._id.toString(),
        );

        // Map category IDs to full category names using the lookup map
        const populatedCategories = course.categories
          .map((categoryId) => categoryMap.get(categoryId.toString()))
          .filter(Boolean); // .filter(Boolean) removes any null/undefined if a category wasn't found

        // This is the async operation that map doesn't wait for
        const instructor = await this.supabaseService.getDataById(
          'profiles',
          course.instructor_id,
        );

        return {
          ...course.toObject(),
          progress: enrollment?.progress ?? 0,
          categories: populatedCategories,
          // Ensure instructor data exists before accessing properties
          instructor: instructor?.[0]?.username ?? 'Unknown Instructor',
        };
      }),
    );

    return coursesWithProgressAndCategories;
  }
  async getEnrolledCourses(id: string): Promise<string[]> {
    const enrollments: any[] = (await this.mongooseService.getDataBySQL(
      this.EnrollmentsModel,
      { user_id: id },
    )) as any[];
    if (!Array.isArray(enrollments) || enrollments.length === 0) {
      return [];
    }
    const courseIds = enrollments.map((e: any) => e.course_id);

    return courseIds;
  }
  async getEnrollmentsByCourse(id: string): Promise<EnrollmentRecord[]> {
    // Fetch enrollments for the given course ID (these are raw from DB, without populated user)
    const rawEnrollments = await this.EnrollmentsModel.find({ course_id: id });

    if (!rawEnrollments || rawEnrollments.length === 0) {
      return [];
    }

    // Extract user IDs from the enrollments
    const userIds = rawEnrollments.map((e: any) => e.user_id);
    if (userIds.length === 0) {
      return [];
    }

    try {
      const supabaseAuthAdmin = (await this.supabaseService.auth()).admin;
      const userPromises = userIds.map(async (userId: string) => {
        const { data: userData, error: userError } =
          await supabaseAuthAdmin.getUserById(userId);
        if (userError) {
          console.error(`Error fetching user ${userId}:`, userError.message);
          return null;
        }
        // Map Supabase user to local User interface, providing a fallback for 'name'
        return {
          id: userData.user.id,
          name:
            userData.user.user_metadata?.name ||
            userData.user.email ||
            'Unknown',
          email: userData.user.email,
          // add other properties as needed
        } as User;
      });

      const fetchedUsersArray = await Promise.all(userPromises);

      // Combine fetched user data with their original enrollment data
      const enrollmentRecords: EnrollmentRecord[] = [];
      for (let i = 0; i < rawEnrollments.length; i++) {
        const rawEnrollment = rawEnrollments[i];
        const userDetail = fetchedUsersArray.find(
          (u) =>
            u &&
            (u.id === rawEnrollment.user_id ||
              (u as any)._id === rawEnrollment.user_id),
        );

        if (userDetail) {
          enrollmentRecords.push({
            _id: rawEnrollment._id?.toString() ?? '', // Enrollment doc ID
            course_id: rawEnrollment.course_id ?? '',
            user_id: rawEnrollment.user_id ?? '',
            user: userDetail, // Populated user detail
            progress: rawEnrollment.progress ?? 0,
            status: rawEnrollment.status ?? 'Unknown',
            enrolled_at: rawEnrollment.enrolled_at ?? new Date(0), // Default to epoch if missing
            // ... other fields from rawEnrollment if necessary
          });
        } else {
          console.warn(
            `User details not found for user_id ${rawEnrollment.user_id} in course ${id}`,
          );
        }
      }
      return enrollmentRecords;
    } catch (error: any) {
      console.error(
        `Error fetching user details for enrollments in course ${id}:`,
        error.message,
      );
      return [];
    }
  }
  async findOneByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<Enrollments | null> {
    return this.EnrollmentsModel.findOne({
      user_id: userId,
      course_id: courseId,
    }).exec();
  }
  async checkAccess(id: string, course_id: string) {
    const access = await this.EnrollmentsModel.findOne({
      user_id: id,
      course_id,
      status: 'Active',
    });

    if (!access) return false;
    return true;
  }
  async updateProgress(updateEnrollmentDto: UpdateEnrollmentDto) {
    const lessons = await this.lessonsService.getLessonsByCourseId(
      updateEnrollmentDto.course_id as string,
      updateEnrollmentDto.user_id as string,
    );

    // Extract lesson IDs
    const lesson_ids = lessons.map((lesson) => lesson._id);

    // Initialize counter for completed lessons
    let completedLessons = 0;

    // Iterate over each lesson and check its progress
    for (const lesson_id of lesson_ids) {
      // Get the progress status of the current lesson
      const lesson = await this.progressService.checkStatus(
        lesson_id,
        updateEnrollmentDto.user_id as string,
      );

      // If the status is "completed", increment the completed lessons counter
      if (lesson && lesson.status === 'completed') {
        completedLessons++;
      }
    }

    // Now, completedLessons contains the number of completed lessons

    // Calculate total lessons for the course
    const totalLessons = lesson_ids.length;
    const progressPercentage = Math.ceil(
      (completedLessons / totalLessons) * 100,
    );

    const enrollment = await this.EnrollmentsModel.findOne({
      user_id: updateEnrollmentDto.user_id,
      course_id: updateEnrollmentDto.course_id,
    });
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    const { data, error } = await this.supabaseService.updateData(
      'enrollments',
      {
        progress: progressPercentage,
      },
      enrollment?._id ??
        (() => {
          throw new Error('Enrollment ID is undefined');
        })(),
    );
    if (error) {
      throw new Error('Error ' + error);
    }
    await this.EnrollmentsModel.updateOne(
      {
        user_id: updateEnrollmentDto.user_id,
        course_id: updateEnrollmentDto.course_id,
      },
      {
        progress: progressPercentage,
      },
    );
  }
  async update(updateEnrollmentDto: UpdateEnrollmentDto, id: string) {
    const { data, error } = await this.supabaseService.updateData(
      'enrollments',
      updateEnrollmentDto,
      id,
    );

    if (error) {
      console.error('Error updating data in Supabase:', error);
      throw error;
    }

    // Update the section in MongoDB
    const mongo = await this.mongooseService.updateData(
      this.EnrollmentsModel,
      id,
      {
        ...updateEnrollmentDto,
      },
    );

    if (!mongo) {
      console.error('Error updating data in MongoDB:', error);
      throw error;
    }

    return data;
  }
  async updateStatus(status: string, id: string, course_ids: string[]) {
    const results = await Promise.all(
      course_ids.map(async (course_id) => {
        try {
          const enrollment = await this.EnrollmentsModel.findOne({
            user_id: id,
            course_id,
          });

          if (!enrollment) {
            console.error(
              `Enrollment not found for user_id: ${id}, course_id: ${course_id}`,
            );
            return {
              success: false,
              course_id,
              message: 'Enrollment not found',
            };
          }

          const { data: supabaseData, error: supabaseError } =
            await this.supabaseService.updateData(
              'enrollments',
              { status },
              enrollment._id,
            );

          if (supabaseError) {
            console.error(
              `Error updating Supabase for course_id ${course_id}:`,
              supabaseError,
            );
            return {
              success: false,
              course_id,
              error: supabaseError,
              database: 'Supabase',
            };
          }

          const mongoUpdateResult = await this.mongooseService.updateData(
            this.EnrollmentsModel,
            enrollment._id,
            { status: status },
          );

          if (!mongoUpdateResult) {
            console.error(
              `Error updating MongoDB for course_id ${course_id}: No document modified.`,
            );
            return {
              success: false,
              course_id,
              message: 'MongoDB update failed or no document modified',
              database: 'MongoDB',
            };
          }

          return { success: true, course_id, supabaseData, mongoUpdateResult };
        } catch (error) {
          console.error(
            `An unexpected error occurred for course_id ${course_id}:`,
            error,
          );
          return {
            success: false,
            course_id,
            error,
            message: 'Unexpected error during update',
          };
        }
      }),
    );

    return results;
  }
  async remove(id: string) {
    await this.supabaseService.deleteData('enrollments', id);
    await this.mongooseService.deleteData(this.EnrollmentsModel, id);

    return { message: 'Enrollment deleted successfully' };
  }
}
