import { IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;
  @IsString()
  username?: string;
  @IsString()
  email?: string;
  @IsString()
  bio?: string;
  @IsString()
  role: string;
}
