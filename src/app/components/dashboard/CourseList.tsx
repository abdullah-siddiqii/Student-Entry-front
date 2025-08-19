// components/dashboard/CourseList.tsx
import { Course } from "../../types";

interface CourseListProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

export default function CourseList({
  courses,
  onEditCourse,
  onDeleteCourse,
}: CourseListProps) {
  return (
    <section className="list-section">
      <h3 className="list-title">📚 All Available Courses</h3>

      {courses.length === 0 ? (
        <p className="empty">No courses available yet.</p>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <h4>{course.courseCode}</h4>
              <p>📘 {course.course}</p>
              <p>⏰ Credit Hours: {course.creditH}</p>
              <p>🗓 Duration: {course.duration} years</p>

              <div className="course-actions">
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => onEditCourse(course)}
                >
                  ✏ Edit
                </button>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDeleteCourse(course._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
