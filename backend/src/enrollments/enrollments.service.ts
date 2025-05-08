import { Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { Model } from 'mongoose';
import { Enrollments } from 'src/schemas/enrollments.schema';
import { Courses } from 'src/schemas/courses.schema';
import { ProgressService } from 'src/progress/progress.service';
import { LessonsService } from 'src/lessons/lessons.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    private readonly progressService: ProgressService,
    private readonly lessonsService: LessonsService,
    @InjectModel(Enrollments.name)
    private readonly EnrollmentsModel: Model<Enrollments>,
    @InjectModel(Courses.name) private readonly CoursesModel: Model<Courses>, // Inject Categories model
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
    const enrollments = await this.EnrollmentsModel.find({ user_id: id });
    const courseIds = enrollments.map((e) => e.course_id);
    const courses = await this.CoursesModel.find({ _id: { $in: courseIds } });

    // Attach progress to each course
    const coursesWithProgress = courses.map((course) => {
      const enrollment = enrollments.find(
        (e) => e.course_id.toString() === course._id.toString(),
      );
      return {
        ...course.toObject(),
        progress: enrollment?.progress ?? 0,
      };
    });

    return coursesWithProgress;
  }

  async checkAccess(id: string, course_id: string) {
    const access = await this.EnrollmentsModel.findOne({
      user_id: id,
      course_id,
    });

    if (!access) return false;
    return true;
  }
  async updateProgress(updateEnrollmentDto: UpdateEnrollmentDto) {
    const lessons = await this.lessonsService.getLessonsLengthByCourseId(
      updateEnrollmentDto.course_id as string,
      updateEnrollmentDto.user_id as string,
    );
    const percent = 100 / lessons;

    const enrollment = await this.EnrollmentsModel.findOne({
      user_id: updateEnrollmentDto.user_id,
      course_id: updateEnrollmentDto.course_id,
    });
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    const newPercent = Math.min(
      Math.ceil(+enrollment.progress + +percent),
      100,
    );

    const { data, error } = await this.supabaseService.updateData(
      'enrollments',
      {
        progress: newPercent,
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
        progress: newPercent,
      },
    );
  }
  async remove(id: string) {
    await this.supabaseService.deleteData('enrollments', id);
    await this.mongooseService.deleteData(this.EnrollmentsModel, id);

    return { message: 'Enrollment deleted successfully' };
  }
}
