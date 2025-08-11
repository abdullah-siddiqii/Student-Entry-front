// components/dashboard/Sidebar.tsx
import { useRouter } from 'next/navigation';
import { DashboardSection } from '../../types';

interface SidebarProps {
  setShowSection: (section: DashboardSection) => void;
  setSidebarOpen: (open: boolean) => void;
  resetStudentForm: () => void;
  resetCourseForm: () => void;
  sidebarOpen: boolean;
}

export default function Sidebar({
  setShowSection,
  setSidebarOpen,
  resetStudentForm,
  resetCourseForm,
  sidebarOpen,
}: SidebarProps) {
  const router = useRouter();

  const handleNavigationClick = (section: DashboardSection) => {
    setShowSection(section);
    setSidebarOpen(false);
    router.push(`/dashboard?section=${section}`);
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <h2>📚 Menu</h2>
      <button
        className="nav-button"
        onClick={() => handleNavigationClick('studentList')}
      >
        📋 Student List
      </button>
      <button
        className="nav-button"
        onClick={() => {
          handleNavigationClick('addStudent');
          resetStudentForm();
        }}
      >
        ➕ Add Student
      </button>
      <button
        className="nav-button"
        onClick={() => {
          handleNavigationClick('addCourse');
          resetCourseForm();
        }}
      >
        ➕ Add Course
      </button>
      <button
        className="nav-button"
        onClick={() => handleNavigationClick('courseList')}
      >
        📋 Course List
      </button>
    </aside>
  );
}