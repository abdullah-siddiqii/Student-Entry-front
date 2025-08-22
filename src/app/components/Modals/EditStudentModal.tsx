// components/dashboard/Modals/EditStudentModal.tsx
"use client";
import { StudentFormData } from "../../types";
import Modal from "react-modal";
import { ChangeEvent, useRef } from "react";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: StudentFormData;
  courses: { _id: string; course: string }[];
  imagePreview: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

if (typeof window !== "undefined") {
  Modal.setAppElement("body");
}

export default function EditStudentModal({
  isOpen,
  onClose,
  formData,
  courses,
  imagePreview,
  onChange,
  onImageChange,
  onSubmit,
}: EditStudentModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Function to trigger hidden file input
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal
      className="modal relative z-[1001]"
      overlayClassName="overlay fixed inset-0 bg-black/50 z-[1000]"
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Student"
    >
      <h2>Edit Student</h2>
      <form onSubmit={onSubmit} className="form">
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        
<img
  src={imagePreview || "/default-avatar.png"}
  alt="Preview"
  style={{ width: 100, height: 100, borderRadius: "50%", cursor: "pointer" }}
  onClick={() => fileInputRef.current?.click()}
/>
</div>
<input
  type="file"
  ref={fileInputRef}
  accept="image/*"
  style={{ display: "none" }}
  onChange={onImageChange}
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
          min={16}
          max={99}
        />

        <select name="course" value={formData.course} onChange={onChange} required>
          {courses.map((c) => (
            <option key={c._id} value={c.course}>
              {c.course}
            </option>
          ))}
        </select>

        <div className="modal-buttons">
          <button type="submit" className="update-button">
            Update
          </button>
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
