import { StudentFormData } from "../../types";
import { ChangeEvent, useState } from "react";

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
  const [imageError, setImageError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setImageError(true);
      return;
    }
    setImageError(false);
    onSubmit(e);
  };

  return (
    <section className="form-section">
      <form onSubmit={handleSubmit} className="form add-student-form">
        <label htmlFor="image-upload" className="image-upload-label">
          <img
            src={imagePreview || "/images/Image.png"}
            alt="Preview"
            className="image-preview"
            // style={{ width: "84px", height: "84px" }}
          />
          <input
            type="file"
            id="image-upload"
            name="image"
            accept="image/*"
            onChange={(e) => {
              onChange(e);
              setImageError(false);
            }}
            style={{ display: "none" }}
          />
          <span className="upload-label-text">+ Add Profile Pic</span>
        </label>
        {imageError && (
          <p style={{ color: "red", fontSize: "0.9rem",display: "block", textAlign: "center", marginTop: "-10px", marginBottom: "10px" }}>
            Profile picture is required
          </p>
        )}

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
