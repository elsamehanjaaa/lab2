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
import { SectionModule } from './section/section.module';
import { LessonsModule } from './lessons/lessons.module';
import { UploadService } from './upload/upload.service';
import { CourseDetailsModule } from './course_details/course_details.module';
import { ProgressModule } from './progress/progress.module';
import { TeachersModule } from './teachers/teachers.module';
import { PaymentsModule } from './payments/payments.module';
import { OrderItemsModule } from './order_items/order_items.module';
import { ContactusModule } from './contactus/contactus.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes ConfigService available in all modules
      envFilePath: '.env', // Optional: specify your .env file path
    }),
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    CoursesModule,
    CategoriesModule,
    EnrollmentsModule,
    SectionModule,
    LessonsModule,
    CourseDetailsModule,
    ProgressModule,
    TeachersModule,
    PaymentsModule,
    OrderItemsModule,
    ContactusModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SupabaseService,
    JwtStrategy,
    MongooseService,
    R2Service,
    UploadService,
  ],
})
export class AppModule {}
