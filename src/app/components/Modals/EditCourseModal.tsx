// components/Modals/EditCourseModal.tsx
import { useState, useEffect } from "react";
import { Course } from "../../types";
import "./EditCourseModal.css"; // Assuming you have some styles for the modal

interface EditCourseProps {
  isOpen: boolean;
  selectedCourse: Course | null;
  onSave: (updatedCourse: Course) => void;
  onClose: () => void;
}

export default function EditCourse({
  isOpen,
  selectedCourse,
  onSave,
  onClose,
}: EditCourseProps) {
  const [formData, setFormData] = useState<Course>({
    _id: "",
    courseCode: "",
    course: "",
    creditH: "",
    duration: 0,
  });

  useEffect(() => {
    if (selectedCourse) {
      setFormData(selectedCourse);
    }
  }, [selectedCourse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "creditH" || name === "duration" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  

  // If modal is closed, don't render anything
  if (!isOpen || !selectedCourse) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>✏ Edit Course</h3>
        <form onSubmit={handleSubmit} className="edit-course-form">
          <label>
            Student Name:
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Course:
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Credit Hours:
            <input
              type="number"
              name="creditH"
              value={formData.creditH}
              onChange={handleChange}
              min={1}
              required
            />
          </label>

          <label>
            Duration (years):
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min={1}
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="save-button">💾 Save</button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>

   
    </div>
  );
}
