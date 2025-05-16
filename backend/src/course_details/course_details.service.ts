import { Injectable } from '@nestjs/common';
import { CreateCourseDetailDto } from './dto/create-course_detail.dto';
import { UpdateCourseDetailDto } from './dto/update-course_detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { CourseDetails } from 'src/schemas/course_details.schema';

@Injectable()
export class CourseDetailsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    @InjectModel(CourseDetails.name)
    private readonly CourseDetailsModel: Model<CourseDetails>,
  ) { }

  async create(createCourseDetailDto: CreateCourseDetailDto) {
    const { data, error } = await this.supabaseService.insertData(
      'course_details',
      createCourseDetailDto,
    );

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const mongo = await this.mongooseService.insertData(this.CourseDetailsModel, {
      ...createCourseDetailDto,
      _id: data[0].id,
    });

    if (!mongo) {
      throw new Error('Error inserting data into MongoDB');
    }

    return data;
  }

  findAll() {
    return `This action returns all courseDetails`;
  }

  findOne(id: string) {
    return `This action returns a #${id} courseDetail`;
  }

  update(id: string, updateCourseDetailDto: UpdateCourseDetailDto) {
    return `This action updates a #${id} courseDetail`;
  }

  remove(id: string) {
    return `This action removes a #${id} courseDetail`;
  }
}
