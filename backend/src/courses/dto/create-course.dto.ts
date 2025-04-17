export class CreateCourseDto {
  title: string;
  description: string;
  price: number;
  categories: string[];
  thumbnail_url: string;
  instructor_id: string;
  slug: string;
  sections: {
    id: number;
    title: string;
    lessons: {
      id: number;
      title: string;
      content?: string;
      type: string;
      video_url: string;
      duration: string;
      url: string;
    }[];
  }[];
}
