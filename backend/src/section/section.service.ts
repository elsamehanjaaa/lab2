import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { Model } from 'mongoose';
import { Section } from 'src/schemas/section.schema';
import { Courses } from 'src/schemas/courses.schema';

@Injectable()
export class SectionService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    @InjectModel(Section.name)
    private readonly SectionsModel: Model<Section>,
    @InjectModel(Courses.name)
    private readonly CoursesModel: Model<Courses>,
  ) {}

  // Create a new section (in both Supabase and MongoDB)
  async create(createSectionDto: CreateSectionDto) {
    // Insert the section into Supabase (external database)
    const { data, error } = await this.supabaseService.insertData(
      'sections',
      createSectionDto,
    );

    if (error) {
      console.error('Error inserting data into Supabase:', error);
      throw error;
    }

    // Insert the section into MongoDB (internal database)
    const mongo = await this.mongooseService.insertData(this.SectionsModel, {
      ...createSectionDto,
      course_id: createSectionDto.course_id.toString(), // Convert course_id to string
      _id: data[0].id, // Use Supabase ID for MongoDB record
    });

    if (!mongo) {
      console.error('Error inserting data into MongoDB:', error);
      throw error;
    }

    return data; // Return the Supabase data (you can modify this to return the MongoDB data if needed)
  }

  // Find all sections in MongoDB
  async findAll() {
    return await this.mongooseService.getAllData(this.SectionsModel);
  }

  // Find one section by ID from MongoDB
  async findOne(id: string) {
    return await this.mongooseService.getDataById(this.SectionsModel, id);
  }
  async getSectionsByCourseId(course_id: string) {
    return await this.mongooseService.getDataBySQL(
      this.SectionsModel,
      {
        course_id: course_id,
      },
      { index: 1 },
    );
  }

  // Remove a section by ID (from both Supabase and MongoDB)
  async remove(id: string) {
    // Delete the section from Supabase
    await this.supabaseService.deleteData('section', id);

    // Delete the section from MongoDB
    await this.mongooseService.deleteData(this.SectionsModel, id);

    return { message: 'Section deleted successfully' };
  }

  // Update section by ID (in both Supabase and MongoDB)
  async update(id: string, updateSectionDto: UpdateSectionDto) {
    // Update the section in Supabase
    const { data, error } = await this.supabaseService.updateData(
      'section',
      updateSectionDto,
      id,
    );

    if (error) {
      console.error('Error updating data in Supabase:', error);
      throw error;
    }

    // Update the section in MongoDB
    const mongo = await this.mongooseService.updateData(
      this.SectionsModel,
      id,
      {
        ...updateSectionDto,
        course_id: updateSectionDto.course_id?.toString(),
      },
    );

    if (!mongo) {
      console.error('Error updating data in MongoDB:', error);
      throw error;
    }

    return data; // Return the updated data (you can modify this to return MongoDB data if needed)
  }
}
