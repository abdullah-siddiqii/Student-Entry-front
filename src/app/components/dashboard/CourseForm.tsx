import { CourseFormData } from "../../types";
import React, { ChangeEvent } from "react";

interface CourseFormProps {
  courseData: CourseFormData;
  editingId: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CourseForm({
  courseData,
  editingId,
  onChange,
  onSubmit,
}: CourseFormProps) {
  return (
    <section className="form-section">
      <form onSubmit={onSubmit} className="form course-form">
        <h3>{editingId ? "✏ Edit Course" : "➕ Add a New Course"}</h3>

        <input
          name="courseCode"
          placeholder="📝 Course Code eg:(CS-101)"
          value={courseData.courseCode}
          onChange={onChange}
          required
        />

        <input
          name="course"
          placeholder="📚 Course Full Name"
          value={courseData.course}
          onChange={onChange}
          required
        />

        <input
          name="creditH"
          type="number"
          placeholder="⏰ Credit Hours (1-5)"
          value={courseData.creditH}
          onChange={onChange}
          required
          min={1}
          max={5}
        />

        <input
          name="duration"
          type="number"
          placeholder="🗓 Duration in Years (1-5)"
          value={courseData.duration}
          onChange={onChange}
          required
          min={1}
          max={5}
        />

        <button type="submit">
          {editingId ? "Update Course" : "Add Course"}
        </button>
      </form>
    </section>
  );
}
