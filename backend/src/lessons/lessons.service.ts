import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { Model } from 'mongoose';
import { Lessons } from 'src/schemas/lessons.schema';
import { Progress } from 'src/schemas/progress.schema';
import { SectionService } from 'src/section/section.service';

@Injectable()
export class LessonsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    private readonly sectionService: SectionService,
    @InjectModel(Lessons.name)
    private readonly LessonsModel: Model<Lessons>,
    @InjectModel(Progress.name)
    private readonly ProgressModel: Model<Progress>,
  ) {}

  // Create a new lesson (in both Supabase and MongoDB)
  async create(createLessonDto: CreateLessonDto) {
    // Insert the lesson into Supabase (external database)
    const { data, error } = await this.supabaseService.insertData(
      'lessons',
      createLessonDto,
    );

    if (error) {
      console.error('Error inserting data into Supabase:', error);
      throw error;
    }

    // Insert the lesson into MongoDB (internal database)
    const mongo = await this.mongooseService.insertData(this.LessonsModel, {
      ...createLessonDto,
      section_id: createLessonDto.section_id.toString(), // Convert section_id to string
      _id: data[0].id, // Use Supabase ID for MongoDB record
    });

    if (!mongo) {
      console.error('Error inserting data into MongoDB:', error);
      throw error;
    }

    return data; // Return the Supabase data (you can modify this to return the MongoDB data if needed)
  }

  // Find all lessons in MongoDB
  async findAll() {
    return await this.mongooseService.getAllData(this.LessonsModel);
  }

  // Find one lesson by ID from MongoDB
  async findOne(id: string) {
    return await this.mongooseService.getDataById(this.LessonsModel, id);
  }

  // Find lessons by course ID from MongoDB

  async getLessonsByCourseId(course_id: string, user_id: string) {
    const sections = await this.sectionService.getSectionsByCourseId(course_id);

    if (!sections || sections.length === 0) {
      console.error('No sections found for the given course ID:', course_id);
      throw new Error('No sections found for the given course ID');
    }

    const allLessons = await Promise.all(
      sections.map(async (section) => {
        return await this.getLessonsBySectionId(section._id, user_id);
      }),
    );

    return allLessons.flat();
  }

  async getLessonsLengthByCourseId(
    course_id: string,
    user_id: string,
  ): Promise<number> {
    try {
      const lessons = await this.getLessonsByCourseId(course_id, user_id);
      return lessons?.length || 0;
    } catch (error) {
      console.error('Failed to get lessons:', error);
      return 0;
    }
  }

  async getLessonsBySectionId(
    section_id: string,
    user_id: string,
  ): Promise<any[]> {
    const lessons = await this.LessonsModel.find({
      section_id: section_id,
    })
      .sort({ index: 1 })
      .exec();

    if (!lessons) {
      return [];
    }
    const lessonsWithProgress = await Promise.all(
      lessons.map(async (lesson) => {
        const progress = await this.ProgressModel.findOne({
          lesson_id: lesson._id,
          user_id: user_id,
        });
        const status = progress ? progress.status : null;
        return {
          ...lesson.toObject(),
          status,
        };
      }),
    );
    return lessonsWithProgress;
  }

  // Remove a lesson by ID (from both Supabase and MongoDB)
  async remove(id: string) {
    // Delete the lesson from Supabase
    await this.supabaseService.deleteData('lessons', id);

    // Delete the lesson from MongoDB
    await this.mongooseService.deleteData(this.LessonsModel, id);

    return { message: 'Lesson deleted successfully' };
  }
}
