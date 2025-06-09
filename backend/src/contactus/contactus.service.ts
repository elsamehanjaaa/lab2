import { Injectable } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contactus.dto';
import { UpdateContactusDto } from './dto/update-contactus.dto';

@Injectable()
export class ContactusService {
  create(createContactusDto: CreateContactUsDto) {
    return 'This action adds a new contactus';
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
