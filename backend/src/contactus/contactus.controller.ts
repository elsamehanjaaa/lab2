import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { ContactusService } from './contactus.service';
import { CreateContactUsDto } from './dto/create-contactus.dto';
import { UpdateContactusDto } from './dto/update-contactus.dto';
import { JwtAuthGuard } from 'src/jwt-strategy/jwt-auth.guard';

@Controller('contactus')
export class ContactusController {
  constructor(private readonly contactusService: ContactusService) {}

  @Post()
  async create(@Body() createContactUsDto: CreateContactUsDto) {
    return this.contactusService.create(createContactUsDto);
  }

  @Get()
  async findAll() {
    return this.contactusService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.contactusService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateContactusDto: UpdateContactusDto,
  ) {
    return this.contactusService.update(id, updateContactusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.contactusService.remove(id);
  }
}