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
  courseCode: string;
  creditH: string;
  duration: number;
  course: string;
};

export type StudentFormData = {
  _id: string;
  name: string;
  email: string;
  age: number|string;           // number (NOT string)
  course: string;
  image: File | null;    // upload ke liye File | null
};



export type CourseFormData = {
  courseCode: string;
  course: string;
  creditH: string;
  duration: string;
};

export type DashboardSection = 'studentList' | 'addStudent' | 'addCourse' | 'courseList';