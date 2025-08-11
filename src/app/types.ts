// types.ts
export type Student = {
  image: string;
  _id: string;
  name: string;
  email: string;
  age: number;
  course: string;
};

export type Course = {
  _id: string;
  sname: string;
  creditH: string;
  duration: number;
  course: string;
};

export type StudentFormData = {
  image: string;
  name: string;
  email: string;
  age: string;
  course: string;
};

export type CourseFormData = {
  sname: string;
  course: string;
  creditH: string;
  duration: string;
};

export type DashboardSection = 'studentList' | 'addStudent' | 'addCourse' | 'courseList';