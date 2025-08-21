'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useRouter } from 'next/navigation';

import StudentList from '../../components/dashboard/StudentList';
import EditStudentModal from '../../components/Modals/EditStudentModal'; // ✅ correct path
import { Student, StudentFormData, DashboardSection } from '../../types';
import Navbar from '../../components/dashboard/Navbar';
import Sidebar from '../../components/dashboard/Sidebar';
import MinMaxRange from '../../components/dashboard/dualslider';

const API_BASE_URL = 'https://abdullah-test.whitescastle.com/api';
const FILE_BASE_URL = 'https://abdullah-test.whitescastle.com'; // images serve hoti hain yahan se

export default function StudentListPage() {
  const router = useRouter();

  // ---------------- States ----------------
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [minAge, setMinAge] = useState<number>(16);
  const [maxAge, setMaxAge] = useState<number>(99);
  const [limit, setLimit] = useState<number>(4);
  const [loading, setLoading] = useState(true);

  // Edit Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>({
    _id: '',
    name: '',
    email: '',
    age: 16,           // ✅ number
    course: '',
    image: null,       // ✅ File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [courses, setCourses] = useState<{ _id: string; course: string }[]>([]);

  // ---------------- Auth Check ----------------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://abdullah-test.whitescastle.com/check-auth', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          router.replace('/login');
          toast.error('Please login to continue');
          return;
        }
        setLoading(false);
      } catch {
        router.replace('/login');
      }
    })();
  }, [router]);

  // ---------------- Fetch Students ----------------
  const fetchStudents = async (
    search: string = searchTerm,
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
        router.replace('/login');
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
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch courses');

      const data = await res.json();
      // debugger
      setCourses(data || []); // assuming API returns { courses: [...] }
    } catch (error) {
      toast.error('❌ Failed to fetch courses');
      console.error('Fetch courses error:', error);
    }
  };

  fetchCourses();
}, []);


  // Single source of truth: jab bhi filters change honge, yeh effect fetch karega.
  useEffect(() => {
    fetchStudents();
  }, [searchTerm, minAge, maxAge, currentPage, limit]); // eslint-disable-line

  // ---------------- Delete Student ----------------
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
        fetchStudents();
      } else {
        toast.error('❌ Delete failed');
      }
    } catch (error) {
      toast.error('Server error during deletion');
      console.error('Delete student error:', error);
    }
  };

  // ---------------- Edit Student (open modal + prefill) ----------------
  const handleEditStudent = (student: Student) => {
    // ✅ map fields explicitly; image hamesha File | null rakho
    setFormData({
      _id: student._id,
      name: student.name,
      email: student.email,
      age: Number(student.age) || 16,
      course: student.course,
      image: null,
    });
    setImagePreview(student.image ? `${FILE_BASE_URL}${student.image}` : null);
    setEditModalOpen(true);
  };


  // ---------------- Modal field change ----------------
  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name } = target;

    if (name === 'image' && target.files) {
      const file = target.files[0] || null;
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
      return;
    }

    if (name === 'age') {
      const valueNum = Number(target.value);
      setFormData((prev) => ({ ...prev, age: isNaN(valueNum) ? prev.age : valueNum }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: target.value }));
  
  };

  // ---------------- Submit update ----------------
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const body = new FormData();
      body.append('name', formData.name);
      body.append('email', formData.email);
      body.append('age', String(formData.age));
      body.append('course', formData.course);
      if (formData.image) body.append('image', formData.image); // ✅ only if new file chosen

      const res = await fetch(`${API_BASE_URL}/students/${formData._id}`, {
        method: 'PUT',
        body,
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('✅ Student updated');
        setEditModalOpen(false);
        setFormData({ _id: '', name: '', email: '', age: 16, course: '', image: null });
        setImagePreview(null);
        fetchStudents();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(`❌ Update failed${err?.message ? `: ${err.message}` : ''}`);
      }
    } catch (err) {
      toast.error('Server error during update');
      console.error(err);
    }
  };

  // ---------------- Search / Filters ----------------
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < maxAge) {
      setMinAge(value);
      setCurrentPage(1);
    }
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > minAge) {
      setMaxAge(value);
      setCurrentPage(1);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  // ---------------- Logout ----------------
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('✅ Logout successful');
        router.replace('/login');
      } else {
        toast.error('❌ Logout failed');
      }
    } catch (err) {
      toast.error('Server error');
      console.error(err);
    }
  };

  if (loading) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <div className="loader"></div>
    </div>
  );
}

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <div style={{ display: 'flex' }}>
        <Sidebar
          setShowSection={(section: DashboardSection) => console.log('Section change:', section)}
          setSidebarOpen={(open: boolean) => console.log('Sidebar open:', open)}
          sidebarOpen={false}
          resetStudentForm={() => {}}
          resetCourseForm={() => {}}
        />

        <main className="main-content">
          <h2 className="title">🎓 Student List</h2>

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
            onEditStudent={handleEditStudent}
          />

          {/* Edit Student Modal */}
          <EditStudentModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            formData={formData}
            imagePreview={imagePreview}
            courses={courses}
            
            onChange={handleModalChange}
            onSubmit={handleModalSubmit}
          />
        </main>
      </div>
    </>
  );
}
function RangeSlider(arg0: boolean) {
  throw new Error('Function not implemented.');
}

