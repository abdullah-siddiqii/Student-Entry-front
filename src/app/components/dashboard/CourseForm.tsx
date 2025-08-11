// components/dashboard/CourseForm.tsx
import { CourseFormData } from "../../types";
import { ChangeEvent } from "react";

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
          name="sname"
          placeholder="📝 Course Short Name (e.g., BSCS)"
          value={courseData.sname}
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
          placeholder="⏰ Credit Hours"
          value={courseData.creditH}
          onChange={onChange}
          required
        />
        <input
          name="duration"
          type="number"
          placeholder="🗓 Duration in Years"
          value={courseData.duration}
          onChange={onChange}
          required
          min="1"
        />
        <button type="submit">
          {editingId ? "Update Course" : "Add Course"}
        </button>
      </form>
    </section>
  );
}