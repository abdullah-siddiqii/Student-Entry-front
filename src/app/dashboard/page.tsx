// app/dashboard/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './dashboard.css';
import { useRouter, useSearchParams } from 'next/navigation';

// Import components
import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import StudentList from '../components/dashboard/StudentList';
import StudentForm from '../components/dashboard/StudentForm';
import CourseList from '../components/dashboard/CourseList';
import CourseForm from '../components/dashboard/CourseForm';
import EditStudentModal from '../components/Modals/EditStudentModal';
import SuccessModal from '../components/Modals/SuccessModal';
// Import types
import { Student, Course, StudentFormData, CourseFormData, DashboardSection } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState<StudentFormData>({
    image: '',
    name: '',
    email: '',
    age: '',
    course: ''
  });
  const [courseData, setCourseData] = useState<CourseFormData>({
    sname: "",
    course: "",
    creditH: "",
    duration: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [minAge, setMinAge] = useState<number>(16);
  const [maxAge, setMaxAge] = useState<number>(99);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [limit, setLimit] = useState<number>(4);
  const [bitemogiVisible, setBitemogiVisible] = useState(false);

  // CORRECT: Initialize showSection with a function that reads the URL params on the client
  const [showSection, setShowSection] = useState<DashboardSection>(() => {
    if (typeof window !== 'undefined') {
      const section = new URLSearchParams(window.location.search).get('section');
      if (section && ['studentList', 'addStudent', 'courseList', 'addCourse'].includes(section)) {
        return section as DashboardSection;
      }
    }
    return 'studentList';
  });
  
  // This useEffect is now redundant and can be removed, as the state is correctly initialized.
  // We'll keep a similar check to handle changes to the URL after the initial load.
  useEffect(() => {
    const section = searchParams?.get('section');
    if (section && ['studentList', 'addStudent', 'courseList', 'addCourse'].includes(section)) {
      setShowSection(section as DashboardSection);
    } else if (!section) {
      router.replace('/dashboard?section=studentList');
    }
  }, [searchParams, router]);

  // Load saved state from localStorage
  useEffect(() => {
    const loadSavedState = () => {
      const storedSearch = localStorage.getItem('searchTerm');
      const storedMin = localStorage.getItem('minAge');
      const storedMax = localStorage.getItem('maxAge');
      const storedPage = localStorage.getItem('currentPage');
      const storedLimit = localStorage.getItem('limit');

      if (storedSearch) setSearchTerm(storedSearch);
      if (storedMin) setMinAge(Number(storedMin));
      if (storedMax) setMaxAge(Number(storedMax));
      if (storedPage) setCurrentPage(Number(storedPage));
      if (storedLimit) setLimit(Number(storedLimit));
    };

    loadSavedState();
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const saveState = () => {
      localStorage.setItem('searchTerm', searchTerm);
      localStorage.setItem('minAge', minAge.toString());
      localStorage.setItem('maxAge', maxAge.toString());
      localStorage.setItem('currentPage', currentPage.toString());
      localStorage.setItem('limit', limit.toString());
    };

    saveState();
  }, [searchTerm, minAge, maxAge, currentPage, limit]);

  // Fetch data
  useEffect(() => {
    fetchStudents(searchTerm, minAge, maxAge, currentPage, limit);
    fetchCourses();
  }, [searchTerm, minAge, maxAge, currentPage, limit]);

  // API functions
  const fetchStudents = async (
    search: string = '',
    min: number = minAge,
    max: number = maxAge,
    page: number = currentPage,
    limitValue: number = limit
  ) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('minAge', String(min));
      params.append('maxAge', String(max));
      params.append('page', String(page));
      params.append('limit', String(limitValue));

      const res = await fetch(`${API_BASE_URL}/students?${params.toString()}`, {
        credentials: 'include',
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      const data = await res.json();
      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      toast.error('❌ Failed to fetch students');
      console.error('Fetch students error:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        credentials: 'include',
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      const data = await res.json();
      setCourses(data || []);
    } catch (error) {
      toast.error('❌ Failed to fetch courses');
      console.error('Fetch courses error:', error);
    }
  };

  // Student CRUD operations
  const deleteStudent = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will permanently delete the student.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) return;

      const res = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('✅ Student deleted');
        fetchStudents(searchTerm, minAge, maxAge, currentPage, limit);
      } else {
        toast.error('❌ Delete failed');
      }
    } catch (error) {
      toast.error('Server error during deletion');
      console.error('Delete student error:', error);
    }
  };

  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, age, course } = formData;

    if (!name || !email || !age || !course || (!editingId && !imageFile)) {
      return toast.error('Please fill all required fields');
    }

    try {
      const formToSend = new FormData();
      formToSend.append('name', name);
      formToSend.append('email', email);
      formToSend.append('age', age);
      formToSend.append('course', course);
      if (imageFile) {
        formToSend.append('image', imageFile);
      }

      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${API_BASE_URL}/students/${editingId}`
        : `${API_BASE_URL}/students`;

      const res = await fetch(url, {
        method,
        credentials: 'include',
        body: formToSend,
      });

      const result = await res.json();
      if (!res.ok) {
        return toast.error(result.message || '❌ Something went wrong');
      }

      toast.success(editingId ? '✅ Student updated' : '✅ Student added');
      resetStudentForm();
      fetchStudents(searchTerm, minAge, maxAge, editingId ? currentPage : 1, limit);

      if (!editingId) {
        setBitemogiVisible(true);
        setTimeout(() => setBitemogiVisible(false), 10000);
      }
    } catch (error) {
      toast.error('Server error');
      console.error('Submit student error:', error);
    }
  };

  const resetStudentForm = () => {
    setFormData({ name: '', email: '', age: '', course: '', image: '' });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setIsModalOpen(false);
  };

  // Course CRUD operations
  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const { sname, course, creditH, duration } = courseData;

    if (!sname || !course || !creditH || !duration) {
      return toast.error('Please fill all required fields');
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${API_BASE_URL}/courses/${editingId}`
        : `${API_BASE_URL}/courses`;

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...courseData,
          duration: Number(courseData.duration)
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        return toast.error(result.message || '❌ Something went wrong');
      }

      toast.success(editingId ? '✅ Course updated' : '✅ Course added');
      resetCourseForm();
      fetchCourses();
    } catch (error) {
      toast.error('Server error');
      console.error('Submit course error:', error);
    }
  };

  const resetCourseForm = () => {
    setCourseData({ sname: "", course: "", creditH: "", duration: "" });
    setEditingId(null);
  };

  const deleteCourse = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will permanently delete the course.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) return;

      const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('✅ Course deleted');
        fetchCourses();
      } else {
        toast.error('❌ Delete failed');
      }
    } catch (error) {
      toast.error('Server error during course deletion');
      console.error('Delete course error:', error);
    }
  };

  // Helper functions
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('✅ Logout successful');
        window.location.href = '/login';
      } else {
        toast.error('❌ Logout failed');
      }
    } catch (error) {
      toast.error('Server error');
      console.error('Logout error:', error);
    }
  };

  const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === 'image' && files && files[0]) {
      const file = files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleChangeCourse = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchStudents(value, minAge, maxAge, 1, limit);
  };

  const getSliderBackground = (
    value: number,
    min: number,
    max: number,
    fillColor: string = '#5cd5e4',
    trackColor: string = '#c3c4cd'
  ) => {
    const percent = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percent}%, ${trackColor} ${percent}%, ${trackColor} 100%)`;
  };

  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < maxAge) {
      setMinAge(value);
      fetchStudents(searchTerm, value, maxAge, 1, limit);
    }
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > minAge) {
      setMaxAge(value);
      fetchStudents(searchTerm, minAge, value, 1, limit);
    }
  };

  const startEditingStudent = (student: Student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      email: student.email,
      age: String(student.age),
      course: student.course,
      image: student.image,
    });
    setImagePreview(`${API_BASE_URL.replace('/api', '')}${student.image}`);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const startEditingCourse = (course: Course) => {
    setCourseData({
      sname: course.sname,
      course: course.course,
      creditH: course.creditH,
      duration: String(course.duration),
    });
    setEditingId(course._id);
    setShowSection('addCourse');
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetSection = (section: DashboardSection) => {
    setShowSection(section);
    router.push(`/dashboard?section=${section}`);
  };

  return (
    
    <>
    <Suspense>
      <Navbar onLogout={handleLogout} />

      <div className="dashboard-container">
        <Sidebar
          setShowSection={handleSetSection}
          setSidebarOpen={setSidebarOpen}
          resetStudentForm={resetStudentForm}
          resetCourseForm={resetCourseForm}
          sidebarOpen={sidebarOpen}
        />

        <main className="main-content">
          <h2 className="title">🎓 Student Management System</h2>

          {showSection === 'addStudent' && (
            <StudentForm
              formData={formData}
              imagePreview={imagePreview}
              editingId={editingId}
              courses={courses}
              onChange={handleChangeStudent}
              onSubmit={handleSubmitStudent}
            />
          )}

          {showSection === 'courseList' && (
            <CourseList
              courses={courses}
              onEditCourse={startEditingCourse}
              onDeleteCourse={deleteCourse}
            />
          )}

          {showSection === 'addCourse' && (
            <CourseForm
              courseData={courseData}
              editingId={editingId}
              onChange={handleChangeCourse}
              onSubmit={handleSubmitCourse}
            />
          )}

          {showSection === 'studentList' && (
            <StudentList
              students={students}
              searchTerm={searchTerm}
              minAge={minAge}
              maxAge={maxAge}
              limit={limit}
              currentPage={currentPage}
              totalPages={totalPages}
              onSearch={handleSearch}
              onMinAgeChange={handleMinAgeChange}
              onMaxAgeChange={handleMaxAgeChange}
              onLimitChange={handleLimitChange}
              onPageChange={handlePageChange}
              onDeleteStudent={deleteStudent}
              onEditStudent={startEditingStudent}
              getSliderBackground={getSliderBackground}
            />
          )}
        </main>
      </div>

      <EditStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        imagePreview={imagePreview}
        courses={courses}
        onChange={handleChangeStudent}
        onSubmit={handleSubmitStudent}
      />

      <SuccessModal
        isOpen={bitemogiVisible}
        onClose={() => setBitemogiVisible(false)}
      />
      </Suspense>
    </>
  );
}