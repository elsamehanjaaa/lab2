import { Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { Model } from 'mongoose';
import { Enrollments } from 'src/schemas/enrollments.schema';
import { Courses } from 'src/schemas/courses.schema';

@Injectable()
export class EnrollmentsService {
  CourseModel: any;
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
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
    console.log(courseIds);

    const courses = await this.CoursesModel.find({ _id: { $in: courseIds } });

    return courses;
  }

  async remove(id: string) {
    await this.supabaseService.deleteData('enrollments', id);
    await this.mongooseService.deleteData(this.EnrollmentsModel, id);

    return { message: 'Enrollment deleted successfully' };
  }
}
