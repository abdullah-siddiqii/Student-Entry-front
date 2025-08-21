'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/dashboard/Navbar';
import toast from 'react-hot-toast';
import './home.css';
import Sidebar from '../components/dashboard/Sidebar';
import { DashboardSection } from '../types';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false); // ✅ track mobile view
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // ✅ check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 668); // mobile if < 768px
    };

    handleResize(); // run initially
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('https://abdullah-test.whitescastle.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      toast.success('Logout Successful');
      router.replace('/login');
    } catch (err) {
      toast.error('Logout failed');
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

      {/* ✅ Sidebar sirf mobile per render hoga */}
      {isMobile && (
        <Sidebar
          setShowSection={function (section: DashboardSection): void {
            throw new Error('Function not implemented.');
          }}
          setSidebarOpen={setSidebarOpen}
          resetStudentForm={function (): void {
            throw new Error('Function not implemented.');
          }}
          resetCourseForm={function (): void {
            throw new Error('Function not implemented.');
          }}
          sidebarOpen={sidebarOpen}
        />
      )}

      <div className="background">
        <div className="container">
          <div className="text-center">
            <h1 className="heading">Welcome to THE UNIVERSITY OF ABDULLAH</h1>
            <p className="heading-text">
              Navigate to the different sections of the dashboard.
            </p>
          </div>

          <div className="main">
            <div className="bitg">
              <img src="/images/cartoonB.png" alt="University Illustration" />
            </div>

            <div className="links-container">
              <Link href="/student/add">
                <div>
                  <h2 className="button">Add Student</h2>
                  <p className="statement">Enroll a new student in the university.</p>
                </div>
              </Link>

              <Link href="/student/list">
                <div>
                  <h2 className="button">Student List</h2>
                  <p className="statement">View the list of enrolled students.</p>
                </div>
              </Link>

              <Link href="/course/add">
                <div>
                  <h2 className="button">Add Course</h2>
                  <p className="statement">Create a new course for students.</p>
                </div>
              </Link>

              <Link href="/course/list">
                <div>
                  <h2 className="button">Course List</h2>
                  <p className="statement">Browse the available courses.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
