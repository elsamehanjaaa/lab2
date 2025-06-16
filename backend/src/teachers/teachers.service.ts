import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { InjectModel } from '@nestjs/mongoose';
import { Teachers } from 'src/schemas/teachers.schema';
import { Model, Types } from 'mongoose';
import { Courses } from 'src/schemas/courses.schema';
import { Enrollments } from 'src/schemas/enrollments.schema';

@Injectable()
export class TeachersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    @InjectModel(Teachers.name)
    private readonly TeachersModel: Model<Teachers>,
    @InjectModel(Courses.name)
    private readonly CoursesModel: Model<Courses>,
    @InjectModel(Enrollments.name)
    private readonly EnrollmentsModel: Model<Enrollments>,
  ) {}
  async create(createTeacherDto: CreateTeacherDto) {
    await this.supabaseService.updateData(
      'profiles',
      { role: 'instructor' },
      createTeacherDto.userId,
    );
    const { data, error } = await this.supabaseService.insertData(
      'teachers',
      createTeacherDto,
    );
    if (error) {
      console.error('Error inserting data:', error);
      throw error;
    }

    const mongo = await this.mongooseService.insertData(this.TeachersModel, {
      ...createTeacherDto,
      _id: data[0].userId,
    });

    if (!mongo) {
      console.error('Error inserting data:', error);
      throw error;
    }

    return data;
  }

  findAll() {
    return `This action returns all teachers`;
  }
  async checkUser(userId: string) {
    const data = await this.mongooseService.getDataById(
      this.TeachersModel,
      userId,
    );
    if (data) return true;
    else return false;
  }
  async getData(instructor_id: string) {
    // 1. Get all courses for the instructor in one query.
    const coursesResult = await this.mongooseService.getDataBySQL(
      this.CoursesModel,
      {
        instructor_id,
      },
    );

    const courses: any[] = Array.isArray(coursesResult) ? coursesResult : [];

    if (courses.length === 0) {
      return { total_courses: 0, total_students: [] };
    }

    const course_ids = courses.map((course) => course._id);

    const all_enrollments_result = await this.mongooseService.getDataBySQL(
      this.EnrollmentsModel,
      {
        course_id: { $in: course_ids },
      },
    );
    const all_enrollments: any[] = Array.isArray(all_enrollments_result)
      ? all_enrollments_result
      : [];

    const total_students = new Set(
      all_enrollments.map((enrollment) => enrollment.user_id),
    );

    const total_courses = courses.length;

    return {
      total_courses,
      total_students: total_students.size,
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}
