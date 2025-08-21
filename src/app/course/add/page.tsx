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
  // 1. Add state to track the active section.
  const [activeSection, setActiveSection] = useState<DashboardSection>('addCourse');
  
  const [courseData, setCourseData] = useState<CourseFormData>({
    courseCode: '',
    course: '',
    creditH: '',
    duration: ''
  });

  const resetCourseForm = () => {
    setCourseData({ courseCode: '', course: '', creditH: '', duration: '' });
  };

  const handleChangeCourse = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const {courseCode, course, creditH, duration } = courseData;

    if (!courseCode || !course || !creditH || !duration) {
      return toast.error('Please fill all required fields');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...courseData,
          duration: Number(courseData.duration)
        }),
      });

      const result = await res.json();
      if (!res.ok) return toast.error(result.message || '❌ Something went wrong' );

      toast.success('✅ Course added');
      resetCourseForm();
    } catch (error) {
      toast.error('Server error');
      console.error('Submit course error:', error);
    }
  };
  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Checking authentication...</p>;
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
      <div style={{display:"flex"}}>
        <div style={{ display: 'flex', height: '1200px' }}>
          {/* 2. Pass the state-updating function to the Sidebar. */}
          <Sidebar
            setShowSection={setActiveSection}
            setSidebarOpen={(open: boolean) => console.log('Sidebar open:', open)}
            resetStudentForm={resetCourseForm}
            resetCourseForm={() => console.log('Reset course form')}
            sidebarOpen={false}
          />
        </div> 
           <main className="flex-1 p-4  Addme"  style={{ width: "100%", display: "flex", flexDirection: "column" , alignItems: "center" }}>
            {/* 3. Conditionally render content based on the activeSection state. */}
            {activeSection === 'addCourse' && (
              <>
                <h2 className="title">➕ Add Course</h2>
                <div style={{ width: '31rem' ,marginLeft:"2 rem"}}>
                  <CourseForm
                    courseData={courseData}
                    editingId={null}
                    onChange={handleChangeCourse}
                    onSubmit={handleSubmitCourse}
                  />
                </div>
              </>
            )}
            {/* You can add more conditional blocks here for other views. */}
          </main>
        </div>
    </>
  );
}