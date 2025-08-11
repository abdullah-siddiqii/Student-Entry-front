// components/dashboard/Modals/EditStudentModal.tsx
import { StudentFormData } from "../../types";
import Modal from "react-modal";
import { ChangeEvent } from "react";
import Image from "next/image";
interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: StudentFormData;
  imagePreview: string | null;
  courses: { _id: string; course: string }[];
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditStudentModal({
  isOpen,
  onClose,
  formData,
  imagePreview,
  courses,
  onChange,
  onSubmit,
}: EditStudentModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Student"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Edit Student</h2>
      <form onSubmit={onSubmit} className="form">
        {imagePreview && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <Image
              src={imagePreview}
              alt="Current Preview"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={onChange}
          className="image-input"
        />
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
          style={{ marginBottom: "0.5rem", padding: "0.3rem" }}
        >
          <option value="">🎓 Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c.course}>
              {c.course}
            </option>
          ))}
        </select>
        <div className="modal-buttons">
          <button type="submit">Update</button>
          <button
            type="button"
            onClick={onClose}
            className="cancel-button"
            style={{ marginTop: "0.5rem" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}