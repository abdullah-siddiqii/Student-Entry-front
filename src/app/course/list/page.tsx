// app/dashboard/course-list-page.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useRouter } from "next/navigation";

import Navbar from "../../components/dashboard/Navbar";
import Sidebar from "../../components/dashboard/Sidebar";
import CourseList from "../../components/dashboard/CourseList";
import EditCourse from "../../components/Modals/EditCourseModal";

import { Course, DashboardSection } from "../../types";

const API_BASE_URL = "https://abdullah-test.whitescastle.com/api";

export default function DashboardCourseList() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSection, setShowSection] = useState<DashboardSection>("courseList");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://abdullah-test.whitescastle.com/check-auth", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          toast.error("Please login to continue");
          router.replace("/login");
          return;
        }

        setLoading(false);
      } catch {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        credentials: "include",
      });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      const data = await res.json();
      setCourses(data || []);
    } catch (error) {
      toast.error("❌ Failed to fetch courses");
      console.error("Fetch courses error:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete course
  const deleteCourse = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the course.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success(" Course deleted");
        fetchCourses();
      } else {
        toast.error(" Delete failed");
      }
    } catch (error) {
      toast.error("Server error during course deletion");
      console.error("Delete course error:", error);
    }
  };

  // Edit course
  const startEditingCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);

  };

  // Save changes from modal
const handleUpdateCourse = async (updatedCourse: Course) => {
  try {
    const res = await fetch(`${API_BASE_URL}/courses/${updatedCourse._id}`, { // <-- add _id here
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        courseCode: updatedCourse.courseCode,
        course: updatedCourse.course,
        creditH: Number(updatedCourse.creditH), // ensure number
        duration: Number(updatedCourse.duration),
      }),
    });

    if (res.ok) {
      toast.success(" Course updated");
      setIsEditModalOpen(false);
      setEditingCourse(null);
      fetchCourses();
    } else {
      const errorData = await res.json();
      toast.error  (errorData.error  );
    }
  } catch (error) {
    toast.error("Server error during update");
    console.error("Update course error:", error);
  }
};


  // Logout
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        toast.success(" Logout successful");
        router.replace("/login");
      } else {
        toast.error(" Logout failed");
      }
    } catch (error) {
      toast.error("Server error");
      console.error("Logout error:", error);
    }
  };

 if (loading) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "22rem" }}>
      <div className="loader"></div>
    </div>
  );
}
  return (
    <>
      <Navbar onLogout={handleLogout} />

      <div className="dashboard-container">
        <Sidebar
          setSidebarOpen={setSidebarOpen}
          resetStudentForm={() => {}}
          resetCourseForm={() => {}}
          sidebarOpen={sidebarOpen}
          setShowSection={setShowSection}
        />

        <main className="main-content">
          <h2 className="title">📚 Course List</h2>

          {showSection === "courseList" && (
            <CourseList
              courses={courses}
              onEditCourse={startEditingCourse}
              onDeleteCourse={deleteCourse}
            />
          )}
        </main>
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <EditCourse
          isOpen={isEditModalOpen}
          selectedCourse={editingCourse}
          onSave={handleUpdateCourse}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCourse(null);
          }}
          
        />
      )}
    </>
  );
}
