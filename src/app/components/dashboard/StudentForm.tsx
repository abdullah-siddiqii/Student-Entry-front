import { StudentFormData } from "../../types";
import { ChangeEvent } from "react";
import Image from "next/image";
interface StudentFormProps {
  formData: StudentFormData;
  imagePreview: string | null;
  editingId: string | null;
  courses: { _id: string; course: string }[];
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function StudentForm({
  formData,
  imagePreview,
  editingId,
  courses,
  onChange,
  onSubmit,
}: StudentFormProps) {
  return (
    <section className="form-section">
      <form onSubmit={onSubmit} className="form add-student-form">
        <label htmlFor="image-upload" className="image-upload-label">
          {imagePreview ? (
            <Image src={imagePreview} alt="Preview" className="image-preview" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="84"
              height="84"
              viewBox="0 0 24 24"
              fill="#888"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4 -4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
          <input
            type="file"
            id="image-upload"
            name="image"
            accept="image/*"
            onChange={onChange}
            style={{ display: "none" }}
          />
          <span className="upload-label-text">+ Add Profile Pic</span>
        </label>

        <input
          name="name"
          placeholder="👤 Name"
          value={formData.name}
          onChange={onChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="📧 Email"
          value={formData.email}
          onChange={onChange}
          required
        />
        <input
          name="age"
          type="number"
          placeholder="🎂 Age"
          value={formData.age}
          onChange={onChange}
          required
          min="16"
          max="99"
        />
        <select
          name="course"
          value={formData.course}
          onChange={onChange}
          required
        >
          <option value="">🎓 Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c.course}>
              {c.course}
            </option>
          ))}
        </select>
        <button type="submit">{editingId ? "Update" : "Add Student"}</button>
      </form>
    </section>
  );
}
