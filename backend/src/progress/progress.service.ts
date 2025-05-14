import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { Progress } from 'src/schemas/progress.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LessonsService } from 'src/lessons/lessons.service';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { response } from 'express';

@Injectable()
export class ProgressService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly lessonsService: LessonsService,
    @InjectModel(Progress.name)
    private readonly ProgressModel: Model<Progress>,
  ) {}
  async createOne(user_id: string, lesson_id: string) {
    const { data, error } = await this.supabaseService.insertData('progress', {
      user_id,
      lesson_id,
      status: 'not_started',
    });

    if (error) {
      console.error('Error inserting data into Supabase:', error);
      throw new Error('Error inserting data into Supabase', error);
    }
    const mongo = await this.mongooseService.insertData(this.ProgressModel, {
      user_id,
      lesson_id,
      status: 'not_started',
      _id: data[0].id, // use Supabase ID to sync with Mongo
    });

    if (!mongo) {
      console.error('Error inserting data into Mongo for lesson:');
      throw new Error('Error inserting data into Mongo');
    }
    return data;
  }
  async create(createProgressDto: CreateProgressDto) {
    const lessons = await this.lessonsService.getLessonsByCourseId(
      createProgressDto.course_id,
      createProgressDto.user_id,
    );
    const lesson_ids = lessons.map((lesson) => lesson._id); // Extract lesson IDs

    const results: any[] = [];

    for (const lesson_id of lesson_ids) {
      const progressEntry = {
        user_id: createProgressDto.user_id,
        lesson_id,
        status: 'not_started', // 👈 Attach the lesson_id for this entry
      };

      const { data, error } = await this.supabaseService.insertData(
        'progress',
        progressEntry,
      );

      if (error) {
        console.error('Error inserting data into Supabase:', error);
        continue; // skip to next lesson
      }

      const mongo = await this.mongooseService.insertData(this.ProgressModel, {
        ...progressEntry,
        _id: data[0].id, // use Supabase ID to sync with Mongo
      });

      if (!mongo) {
        console.error('Error inserting data into Mongo for lesson:', lesson_id);
        continue;
      }

      results.push(data[0]);
    }

    return results; // return all successfully created progress entries
  }
  async update(updateProgressDto: UpdateProgressDto) {
    const progress = await this.ProgressModel.findOne({
      user_id: updateProgressDto.user_id,
      lesson_id: updateProgressDto.lesson_id,
    });

    await this.supabaseService.updateData(
      'progress',
      { status: updateProgressDto.status },
      progress?._id ??
        (() => {
          throw new Error('Progress ID is undefined');
        })(),
    );
    await this.mongooseService.updateData(this.ProgressModel, progress._id, {
      status: updateProgressDto.status,
    });

    if (updateProgressDto.status === 'completed') {
      await this.enrollmentsService.updateProgress({
        user_id: updateProgressDto.user_id,
        course_id: updateProgressDto.course_id,
      });
    }
    return response.status(200);
  }
  async checkStatus(lesson_id: string, user_id: string) {
    return await this.ProgressModel.findOne({
      user_id,
      lesson_id,
    })
      .select('status')
      .exec();
  }
  findAll() {
    return `This action returns all progress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} progress`;
  }

  remove(id: number) {
    return `This action removes a #${id} progress`;
  }
}
