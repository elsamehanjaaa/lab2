import { PartialType } from '@nestjs/mapped-types';
import { CreateProgressDto } from './create-progress.dto';
import { IsIn, IsString } from 'class-validator';

export class UpdateProgressDto extends PartialType(CreateProgressDto) {
  @IsString()
  lesson_id: string;
  @IsString()
  @IsIn(['not_started', 'incomplete', 'completed'])
  status: string;
}
