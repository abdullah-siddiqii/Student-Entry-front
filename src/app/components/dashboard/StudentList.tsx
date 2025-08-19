// components/dashboard/StudentList.tsx
"use client";
import React from "react";
import { Slider } from "@heroui/react";
import { Student } from "../../types";
import MinMaxRange from "./dualslider";

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
}: StudentListProps) {
  const handleSliderChange = (val: number | number[]) => {
    if (Array.isArray(val)) {
      onMinAgeChange({ target: { value: val[0].toString() } } as React.ChangeEvent<HTMLInputElement>);
      onMaxAgeChange({ target: { value: val[1].toString() } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <section className="list-section">
      {/* Search & Filters */}
      <div className="search-filters">
        <input
          type="text"
          placeholder="🔍 Search by name or course"
          value={searchTerm}
          onChange={onSearch}
          className="search-input"
        />

        <div className="dd ">
      <MinMaxRange
    minAge={minAge}
    maxAge={maxAge}
    onChange={(min, max) => {
      onMinAgeChange({ target: { value: min.toString() } } as React.ChangeEvent<HTMLInputElement>);
      onMaxAgeChange({ target: { value: max.toString() } } as React.ChangeEvent<HTMLInputElement>);
    }}
  />
        </div>

        <div className="limit-selector">
          <label>📄 Students per page:</label>
          <select value={limit} onChange={onLimitChange}>
            {[2, 4, 6, 10, 20].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students List */}
      {students.length === 0 ? (
        <p className="empty">No students found.</p>
      ) : (
        <>
          <div className="student-list">
            {students.map((student) => (
              <div key={student._id} className="student-card">
                {student.image && (
                  <img
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
                  <button onClick={() => onDeleteStudent(student._id)} className="delete-button">🗑 Delete</button>
                  <button onClick={() => onEditStudent(student)} className="edit-button">✏ Edit</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>⬅ Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Next ➡</button>
          </div>
        </>
      )}
    </section>
  );
}
