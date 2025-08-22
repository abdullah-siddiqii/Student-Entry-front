'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CourseForm from '../../components/dashboard/CourseForm';
import { CourseFormData, DashboardSection } from '../../types';
import Navbar from '../../components/dashboard/Navbar';
import Sidebar from '../../components/dashboard/Sidebar';
import Modal from 'react-modal';
import { useRouter } from 'next/dist/client/components/navigation';

const API_BASE_URL = 'https://abdullah-test.whitescastle.com/api';
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

export default function AddCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
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

        await res.json();
        setLoading(false);
      } catch (err) {
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  const [activeSection, setActiveSection] = useState<DashboardSection>('addCourse');

  const [courseData, setCourseData] = useState<CourseFormData>({
    courseCode: '',
    course: '',
    creditH: '',
    duration: '',
  });

  const resetCourseForm = () => {
    setCourseData({ courseCode: '', course: '', creditH: '', duration: '' });
  };

  const handleChangeCourse = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCourse = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const { courseCode, course, creditH, duration } = courseData;

    if (!courseCode || !course || !creditH || !duration) {
      toast.error('Please fill all required fields');
      return;
    }

    await toast.promise(
      (async () => {
        const res = await fetch(`${API_BASE_URL}/courses`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...courseData,
            duration: Number(courseData.duration),
            creditH: Number(courseData.creditH),
          }),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Something went wrong');

        resetCourseForm();
        setTimeout(() => {
          router.push('/course/list');
        }, 1500);
      })(),
      {
        loading: 'Adding course...',
        success: 'Course added successfully!',
        error: (err) => err.message || 'Something went wrong',
      }
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '22rem' }}>
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
        toast.success('Logout successful');
        window.location.href = '/login';
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      toast.error('Server error');
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', height: '1200px' }}>
          <Sidebar
            setShowSection={setActiveSection}
            setSidebarOpen={(open: boolean) => console.log('Sidebar open:', open)}
            resetStudentForm={resetCourseForm}
            resetCourseForm={() => console.log('Reset course form')}
            sidebarOpen={false}
          />
        </div>
        <main
          className="flex-1 p-4 Addme"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {activeSection === 'addCourse' && (
            <>
              <h2 className="title">➕ Add Course</h2>
              <div style={{ width: '31rem', marginLeft: '2rem' }}>
                <CourseForm
                  courseData={courseData}
                  editingId={null}
                  onChange={handleChangeCourse}
                  onSubmit={handleSubmitCourse}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
