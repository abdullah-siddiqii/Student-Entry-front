'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import StudentForm from '../../components/dashboard/StudentForm';
import SuccessModal from '../../components/Modals/SuccessModal';
import { StudentFormData, Course, DashboardSection } from '../../types';
import Navbar from '../../components/dashboard/Navbar';
import Sidebar from '../../components/dashboard/Sidebar';
import Modal from 'react-modal';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'https://abdullah-test.whitescastle.com/api';
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}


export default function AddStudentPage() {
  const [formData, setFormData] = useState<StudentFormData>({
    _id: '', // Add _id property to match StudentFormData type
    image: null,
    name: '',
    email: '',
    age:'',
    course: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bitemogiVisible, setBitemogiVisible] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('https://abdullah-test.whitescastle.com/check-auth', {
          method: 'GET',
          credentials: 'include', // send cookie
        });

        if (!res.ok) {
          router.replace('/login');
           toast.error('Please login to continue');
          return;
        }

        const data = await res.json();
        setLoading(false); // ✅ now we can render the page
      } catch (err) {
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);
  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/courses`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        } else {
          console.error('Failed to load courses');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
     Modal.setAppElement('body');
    fetchCourses();
  }, []);

  const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetStudentForm = () => {
    setFormData({ _id: '', name: '', email: '', age: 0, course: '', image: null });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, age, course } = formData;

    if (!name || !email || !age || !course || !imageFile) {
      return toast.error('Please fill all required fields');
    }

    try {
      const formToSend = new FormData();
      formToSend.append('name', name);
      formToSend.append('email', email);
      formToSend.append('age', age.toString());
      formToSend.append('course', course);
      formToSend.append('image', imageFile);

      const res = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        credentials: 'include',
        body: formToSend,
      });

      const result = await res.json();
      if (!res.ok) return toast.error(result.message || '❌ Something went wrong');

      toast.success('✅ Student added');
      resetStudentForm();

      setBitemogiVisible(true);
      setTimeout(() => setBitemogiVisible(false), 10000);

    } catch (error) {
      toast.error('Server error');
      console.error('Submit student error:', error);
    }
  };
  if (loading) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <div className="loader"></div>
    </div>
  );
}

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
  return (
    <>
     <Navbar onLogout={handleLogout} />
      
      <div style={{ display: "flex", flexDirection: "row" }}>
        {/* Sidebar */}
        <div style={{ display: "flex", height: "1200px" }}>
          <Sidebar
            setShowSection={(section: DashboardSection) => console.log('Section change:', section)}
            setSidebarOpen={(open: boolean) => console.log('Sidebar open:', open)}
            resetStudentForm={resetStudentForm}
            resetCourseForm={() => console.log('Reset course form')}
            sidebarOpen={false}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4  Addme"  style={{ width: "100%", display: "flex", flexDirection: "column" , alignItems: "center" }}>
          <h2 className="title">➕ Add Student</h2>
          <div style={{ width: "31rem" }}>
            <StudentForm
              formData={formData}
              imagePreview={imagePreview}
              editingId={null} // no editing
              courses={courses}
              onChange={handleChangeStudent}
              onSubmit={handleSubmitStudent}
            />
          </div>

          <SuccessModal
            isOpen={bitemogiVisible}
            onClose={() => setBitemogiVisible(false)}
          />
        </main>
      </div>
    </>
  );
}
