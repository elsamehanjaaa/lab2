import { IsString } from 'class-validator';

export class GetEnrollmentsByUserDto {
  @IsString()
  user_id: string;
}
