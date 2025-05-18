import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { Model } from 'mongoose';
import { Lessons } from 'src/schemas/lessons.schema';
import { Progress } from 'src/schemas/progress.schema';
import { SectionService } from 'src/section/section.service';
import { ProgressService } from 'src/progress/progress.service';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class LessonsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    @Inject(forwardRef(() => SectionService)) // Use forwardRef and Inject here
    private readonly sectionService: SectionService,
    private readonly progressService: ProgressService,
    private readonly uploadService: UploadService,
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

  async getLessonsByCourseId(course_id: string, user_id?: string) {
    const sections = await this.sectionService.getSectionsByCourseId(course_id);

    if (!sections || sections.length === 0) {
      console.error('No sections found for the given course ID:', course_id);
      throw new Error('No sections found for the given course ID');
    }

    const allLessons = await Promise.all(
      sections.map(async (section) => {
        if (user_id) {
          return await this.getLessonsBySectionId(section._id, user_id);
        } else {
          return await this.getLessonsBySectionId(section._id);
        }
      }),
    );

    return allLessons.flat();
  }

  async getLessonsBySectionId(
    section_id: string,
    user_id?: string,
  ): Promise<any[]> {
    const lessons = await this.LessonsModel.find({
      section_id: section_id,
    })
      .sort({ index: 1 })
      .exec();

    if (!lessons) {
      return [];
    }
    if (user_id) {
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
    return lessons;
  }
  async getLessonsTitleBySectionId(section_id: string): Promise<any[]> {
    const lessons = await this.LessonsModel.find({
      section_id: section_id,
    })
      .sort({ index: 1 })
      .exec();

    if (!lessons) {
      return [];
    }

    return lessons;
  }
  // Update an existing lesson
  async update(id: string, updateLessonDto: UpdateLessonDto) {
    // Update in Supabase

    const { data, error } = await this.supabaseService.updateData(
      'lessons',
      updateLessonDto,
      id,
    );

    if (error) {
      console.error('Error updating data in Supabase:', error);
      throw error;
    }

    // Update in MongoDB
    const mongo = await this.mongooseService.updateData(this.LessonsModel, id, {
      ...updateLessonDto,
      section_id: updateLessonDto.section_id?.toString(), // Convert section_id to string
    });

    if (!mongo) {
      throw new Error('Error updating data in MongoDB');
    }

    return data;
  }

  // Remove a lesson by ID (from both Supabase and MongoDB)
  async remove(id: string) {
    try {
      const lesson = await this.findOne(id);
      // Delete the lesson from Supabase
      await this.supabaseService.deleteData('lessons', id);

      // Delete the lesson from MongoDB
      await this.mongooseService.deleteData(this.LessonsModel, id);

      await this.progressService.removeByLesson(id);

      const key = lesson?.video_url.replace(
        (process.env.Cloudflare_Lessons_Public_Url as string) + '/',
        '',
      ) as string;
      console.log(key);

      await this.uploadService.handleDeleteFile('lessons', key);

      return { message: 'Lesson deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete esson: ${error.message}`);
    }
  }
  async removeBySection(section_id: string) {
    // Delete the lesson from Supabase
    const lessons = await this.getLessonsBySectionId(section_id);
    await Promise.all(lessons.map((lesson) => this.remove(lesson._id)));
    return { message: 'Lesson deleted successfully' };
  }
}
