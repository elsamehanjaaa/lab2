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
  ) {}

  async create(createCourseDetailDto: CreateCourseDetailDto) {
    const { data, error } = await this.supabaseService.insertData(
      'course_details',
      createCourseDetailDto,
    );

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    let { course_id, ...restCourseDetailDto } = createCourseDetailDto;
    const mongo = await this.mongooseService.insertData(
      this.CourseDetailsModel,
      {
        ...restCourseDetailDto,
        _id: course_id,
      },
    );

    if (!mongo) {
      throw new Error('Error inserting data into MongoDB');
    }

    return data;
  }

  findAll() {
    return `This action returns all courseDetails`;
  }

  async findOne(id: string) {
    return await this.mongooseService.getDataById(this.CourseDetailsModel, id);
  }

  async update(id: string, updateCourseDetailDto: UpdateCourseDetailDto) {
    try {
      const { data, error } = await this.supabaseService.updateData(
        'course_details',
        updateCourseDetailDto,
        id,
        'course_id',
      );
      if (error) throw new Error('Error updating data into Supabase');
      await this.mongooseService.updateData(
        this.CourseDetailsModel,
        id,
        updateCourseDetailDto,
      );
      return data;
    } catch (error) {
      console.log(error);

      throw new Error('Error updating data into MongoDB');
    }
  }

  async remove(id: string) {
    await this.supabaseService.deleteData('course_details', id, 'course_id');
    await this.mongooseService.deleteData(this.CourseDetailsModel, id);
  }
}
