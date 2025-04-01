import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Courses } from '../schemas/courses.schema';

@Injectable()
export class CoursesService {
  constructor(private readonly supabaseService: SupabaseService, private readonly mongooseService: MongooseService, @InjectModel(Courses.name) private readonly CoursesModel: Model<Courses>,) {}


 async create(createCourseDto: CreateCourseDto) {
    return await this.supabaseService.insertData("courses", createCourseDto);
  }

  async findAll() {
    return await this.supabaseService.getData('courses')
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
