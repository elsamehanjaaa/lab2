import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { InjectModel } from '@nestjs/mongoose';
import { Teachers } from 'src/schemas/teachers.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TeachersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    @InjectModel(Teachers.name)
    private readonly TeachersModel: Model<Teachers>,
  ) {}
  async create(createTeacherDto: CreateTeacherDto) {
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
