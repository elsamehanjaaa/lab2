import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './jwt-strategy/jwt-strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseService } from './mongoose/mongoose.service';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';
import { CategoriesModule } from './categories/categories.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { R2Service } from './r2/r2.service';
import { UploadController } from './upload/upload.controller';
import { SectionModule } from './section/section.module';
import { LessonsModule } from './lessons/lessons.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    CoursesModule,
    CategoriesModule,
    EnrollmentsModule,
    SectionModule,
    LessonsModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, SupabaseService, JwtStrategy, MongooseService, R2Service],
})
export class AppModule {}
