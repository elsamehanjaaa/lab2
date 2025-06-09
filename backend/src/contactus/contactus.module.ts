import { Module } from '@nestjs/common';
import { ContactusService } from './contactus.service';
import { ContactusController } from './contactus.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContactUs,
  ContactUsSchema,
} from 'src/schemas/contactus.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactUs.name, schema: ContactUsSchema },
    ]),
  ],
  controllers: [ContactusController],
  providers: [ContactusService, SupabaseService, MongooseService],
  exports: [ContactusService, MongooseModule],
})
export class ContactUsModule {}
