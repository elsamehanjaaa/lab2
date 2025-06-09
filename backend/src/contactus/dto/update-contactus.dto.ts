import { PartialType } from '@nestjs/mapped-types';
import { CreateContactUsDto } from './create-contactus.dto';

export class UpdateContactusDto extends PartialType(CreateContactUsDto) {}
 
 
