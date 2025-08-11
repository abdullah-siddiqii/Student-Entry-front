// components/dashboard/StudentList.tsx
import { Student } from "../../types";
import Image from "next/image";
interface StudentListProps {
  students: Student[];
  searchTerm: string;
  minAge: number;
  maxAge: number;
  limit: number;
  currentPage: number;
  totalPages: number;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMinAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLimitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPageChange: (page: number) => void;
  onDeleteStudent: (id: string) => void;
  onEditStudent: (student: Student) => void;
  getSliderBackground: (
    value: number,
    min: number,
    max: number,
    fillColor?: string,
    trackColor?: string
  ) => string;
}


export default function StudentList({
  students,
  searchTerm,
  minAge,
  maxAge,
  limit,
  currentPage,
  totalPages,
  onSearch,
  onMinAgeChange,
  onMaxAgeChange,
  onLimitChange,
  onPageChange,
  onDeleteStudent,
  onEditStudent,
  getSliderBackground,
}: StudentListProps) {
  return (
    <section className="list-section">
      <div className="search-filters">
        <input
          type="text"
          placeholder="🔍 Search by name or course"
          value={searchTerm}
          onChange={onSearch}
          className="search-input"
        />
        <div className="slider-container">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "0.5rem",
            }}
          >
            Age Range: <strong>{minAge} - {maxAge}</strong>
          </label>
          <div className="slider-wrapper">
            <div className="slider-group">
              <span>Min</span>
              <input
                type="range"
                min="16"
                max="99"
                value={minAge}
                onChange={onMinAgeChange}
                style={{ background: getSliderBackground(minAge, 16, 99) }}
              />
            </div>
            <div className="slider-group">
              <span>Max</span>
              <input
                type="range"
                min="16"
                max="99"
                value={maxAge}
                onChange={onMaxAgeChange}
                style={{ background: getSliderBackground(maxAge, 16, 99) }}
              />
            </div>
          </div>
        </div>
        <div className="limit-selector">
          <label>📄 Students per page:</label>
          <select
            value={limit}
            onChange={onLimitChange}
          >
            {[2, 4, 6, 10, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {students.length === 0 ? (
        <p className="empty">No students found.</p>
      ) : (
        <>
          <div className="student-list">
            {students.map((student) => (
              <div key={student._id} className="student-card">
                {student.image && (
                //   <img
                //     src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
                //       "/api",
                //       ""
                //     )}${student.image}`}
                //     alt={student.name}
                //    
                //   />
             <Image
  src={`http://localhost:5000${student.image}`} 
  alt={student.name} 
  className="student-image" 
/>


                )}
                <h3>{student.name}</h3>
                <p>📧 {student.email}</p>
                <p>🎓 {student.course}</p>
                <p>🎂 {student.age} years old</p>
                <div className="student-actions">
                  <button
                    onClick={() => onDeleteStudent(student._id)}
                    className="delete-button"
                  >
                    🗑 Delete
                  </button>
                  <button
                    onClick={() => onEditStudent(student)}
                    className="edit-button"
                  >
                    ✏ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              ⬅ Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </section>
  );
}