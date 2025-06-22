import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { GetEnrollmentsByUserDto } from './dto/get-enrollemnt-by-user.dto';
import { JwtAuthGuard } from 'src/jwt-strategy/jwt-auth.guard';
import { CoursesService } from 'src/courses/courses.service';
interface Course {
  _id: string;
  title: string;
  // other course properties like description, price, etc.
}

// Represents a user object, typically part of an enrollment record
interface User {
  id?: string; // or _id if that's your primary user identifier
  _id?: string; // add _id as optional to match possible user object shapes
  name: string;
  email: string;
  // other user properties
}

interface EnrollmentRecord {
  _id: string; // The ID of the enrollment document itself
  course_id: string;
  user_id: string;
  user: User; // Populated user details
  progress: number; // e.g., percentage completion
  status: string; // e.g., 'Active', 'Completed', 'Pending'
  enrolled_at: Date | string; // Date of enrollment
  // any other enrollment-specific fields you might have
}

// Defines the structure of the objects in the 'enrolledCourses' array for the response
interface EnrolledCourseDetail {
  id: string; // Course ID
  title: string; // Course Title
  progress: number;
  status: string;
  enrolled_at: Date | string;
}

// Defines the structure of the final response objects
interface StudentWithCourseDetails {
  student: User;
  enrolledCourses: EnrolledCourseDetail[];
}
@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly coursesService: CoursesService,
  ) {}

  @Post()
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return await this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getEnrollmentsByUser')
  async getByName(@Req() req) {
    const userId = (req.user as any).id;
    return await this.enrollmentsService.getEnrollmentsByUser(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('getEnrolledCourses')
  async getEnrolledCourses(@Req() req) {
    const userId = (req.user as any).id;
    const course_ids = await this.enrollmentsService.getEnrolledCourses(userId);
    return course_ids;
  }
  @Post('check-access')
  @UseGuards(JwtAuthGuard)
  async checkAccess(@Req() req, @Body() body: any) {
    const userId = (req.user as any).id;

    if (!body || !body.course_id) {
      throw new BadRequestException('Missing course_id');
    }

    const access = await this.enrollmentsService.checkAccess(
      userId,
      body.course_id,
    );

    return access;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(id);
  }

  @Post('getStudentsFromInstructor')
  async getStudentsFromInstructor(
    @Body() body: { instructor_id: string },
  ): Promise<StudentWithCourseDetails[]> {
    const { instructor_id } = body;

    if (!instructor_id) {
      throw new BadRequestException('instructor_id is required');
    }

    try {
      // 1. Get all courses for the instructor
      const courses: Course[] =
        await this.coursesService.getCoursesByInstructor(instructor_id);

      if (!courses || courses.length === 0) {
        return []; // No courses, so no students to return
      }

      // 2. Data structure to hold students and their enriched enrolled courses
      // Key: student_id, Value: StudentWithCourseDetails
      const studentsDataMap = new Map<string, StudentWithCourseDetails>();

      // 3. For each course, get its enrollments and populate the map
      for (const course of courses) {
        if (!course || !course._id || !course.title) {
          console.warn(
            'Skipping course with missing _id or title:',
            JSON.stringify(course),
          );
          continue;
        }

        // getEnrollmentsByCourse should now return an array of EnrollmentRecord objects
        // where each record includes the populated 'user' object.
        const enrollmentRecords: EnrollmentRecord[] =
          await this.enrollmentsService.getEnrollmentsByCourse(course._id);

        if (enrollmentRecords && enrollmentRecords.length > 0) {
          enrollmentRecords.forEach((enrollment) => {
            // Validate essential enrollment and user data
            if (
              !enrollment ||
              !enrollment.user ||
              !(enrollment.user.id || enrollment.user._id) ||
              typeof enrollment.progress === 'undefined' ||
              !enrollment.status ||
              !enrollment.enrolled_at
            ) {
              console.warn(
                `Skipping enrollment with missing critical data for course ${course._id}:`,
                JSON.stringify(enrollment),
              );
              return;
            }

            const studentDetails: User = enrollment.user; // User details are directly from the enrollment record
            const studentIdRaw = studentDetails.id || studentDetails._id; // Prefer 'id', fallback to '_id'
            const studentId = studentIdRaw!.toString(); // Ensure string type

            const courseDetailForStudent: EnrolledCourseDetail = {
              id: course._id, // This is the course_id
              title: course.title,
              progress: enrollment.progress,
              status: enrollment.status,
              enrolled_at: enrollment.enrolled_at,
            };

            if (!studentsDataMap.has(studentId)) {
              // If student is not in map, add them with current course enrollment details
              studentsDataMap.set(studentId, {
                student: studentDetails,
                enrolledCourses: [courseDetailForStudent],
              });
            } else {
              // If student is already in map, add this course's enrollment details to their list
              const existingEntry = studentsDataMap.get(studentId)!;
              // Prevent adding duplicate course details if by some chance the same enrollment record is processed twice
              if (
                !existingEntry.enrolledCourses.some(
                  (ec) => ec.id === course._id,
                )
              ) {
                existingEntry.enrolledCourses.push(courseDetailForStudent);
              }
            }
          });
        }
      }

      // 4. Convert map values to an array for the response
      const result: StudentWithCourseDetails[] = Array.from(
        studentsDataMap.values(),
      );

      return result;
    } catch (error: any) {
      console.error(
        `Error fetching students and their courses for instructor ${instructor_id}:`,
        error,
      );
      throw new InternalServerErrorException(
        `Failed to retrieve students and their courses: ${error.message}`,
      );
    }
  }

  @Patch(':id')
  async update(
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
    @Param('id') id: string,
  ) {
    return this.enrollmentsService.update(updateEnrollmentDto, id);
  }
  @Post('updateStatus')
  async updateStatus(
    @Body() body: { id: string; status: string; courses_ids: string[] },
  ) {
    return this.enrollmentsService.updateStatus(
      body.status,
      body.id,
      body.courses_ids,
    );
  }
}
