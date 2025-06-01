import { Injectable } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contactus.dto';
import { UpdateContactusDto } from './dto/update-contactus.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactUs } from 'src/schemas/contactus.schema';

@Injectable()
export class ContactusService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    @InjectModel(ContactUs.name)
    private readonly ContactUsModel: Model<ContactUs>,
  ) {}
  async create(createContactusDto: CreateContactUsDto) {
    const { data, error } = await this.supabaseService.insertData(
      'contact_us',
      createContactusDto,
    );

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const mongo = await this.mongooseService.insertData(this.ContactUsModel, {
      ...createContactusDto,
      _id: data[0].id,
    });

    if (!mongo) {
      throw new Error('Error inserting data into MongoDB');
    }

    return data;
  }

  findAll() {
    return `This action returns all contactus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contactus`;
  }

  update(id: number, updateContactusDto: UpdateContactusDto) {
    return `This action updates a #${id} contactus`;
  }

  remove(id: number) {
    return `This action removes a #${id} contactus`;
  }
}
