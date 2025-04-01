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
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService, JwtStrategy, MongooseService],
})
export class AppModule {}
