// components/dashboard/Sidebar.tsx
import { useRouter } from 'next/navigation';
import { DashboardSection } from '../../types';
import Link from 'next/link';

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

  // Async handlers to ensure route change and state update sync properly
  const handleAddStudent = async () => {
    resetStudentForm();
    setShowSection('addStudent');
    setSidebarOpen(false);
    await router.push('/student/add');
  };

  const handleStudentList = async () => {
    setShowSection('studentList');
    setSidebarOpen(false);
    await router.push('/student/list');
  };

const handleAddCourse = async () => {
  resetCourseForm();
  setShowSection('addCourse');
  setSidebarOpen(false);
  try {
    await router.push('/course/add');
  } catch(e) {
    console.error('Router push failed:', e);
  }
};


  const handleCourseList = async () => {
    setShowSection('courseList');
    setSidebarOpen(false);
    await router.push('/course/list');
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <h2>📚 Menu</h2>

      <Link href={'/student/add'} className="nav-button"> 
        ➕ Add Student
      </Link>

      <Link href={'/student/list'} className="nav-button" >
        📋 Student List
      </Link>

      <Link href={'/course/add'} className="nav-button">
        ➕ Add Course
      </Link>

      <Link href={'/course/list'} className="nav-button" >
        📋 Course List
      </Link>
    </aside>
  );
}
