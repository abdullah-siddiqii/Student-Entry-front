'use client';

import { useEffect, useState } from 'react';
import './dashboard.css';
import toast from 'react-hot-toast';

type Student = {
  _id: string;
  name: string;
  email: string;
  age: number;
  course: string;
};

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', age: '', course: '' });
  const [message, setMessage] = useState('');
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students', {
        credentials: 'include',
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      toast.error("Failed to fetch Students")
      setMessage('❌ Failed to fetch students');
    }
  };

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleLogout = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (res.ok) {
      window.location.href = '/login';
      toast.success("Logout successfull")
      
    } else {
      toast.error("Logout Failed")
      alert('Logout failed');
    }
  } catch (err) {
    console.error('Logout error:', err);
    alert('Server error during logout');
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(`✅ Student "${result.name}" added!`);
        toast.success("Student Added Successfull")
        setTimeout(() => setMessage(''), 3000);
        setFormData({ name: '', email: '', age: '', course: '' });
        fetchStudents();
      } else {
        setMessage(`❌ Error: ${result.message || 'Something went wrong'}`);
        toast.error("Submit Failed")
      }
    } catch (err) {
    toast.error("Submit Failed")
      setMessage('❌ Failed to submit');
    }
  };

  const deleteStudent = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:5000/api/students/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const result = await res.json();

    if (res.ok) {
      toast.success(result.message || 'Student deleted');
      fetchStudents(); // update list
    } else {
      toast.error(result.message || 'Delete failed');
    }
  } catch (error) {
    toast.error('Server error');
  }
};

  return (
    <>
      {/* Top Navbar */}
      <header className="navbar">
  <div className="navbar-content">
    <img src="/images/Logo.png" alt="University Logo" className="logo" />
    <h1 className="uni-name">The University of Abdullah</h1>
</div>
  <button className="signout-btn" onClick={handleLogout}>
  <span className="logout-icon">🔒</span>
 Log out
</button>

</header>

      {/* Main Layout */}
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>📚 Menu</h2>
          <button className="nav-button" onClick={() => setShowList(true)}>📋 Student List</button>
          <button className="nav-button" onClick={() => setShowList(false)}>➕ Add Student</button>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <h2 className="title">🎓 Student Management System</h2>


          {!showList ? (
            <section className="form-section">
              <form onSubmit={handleSubmit} className="form">
                <input name="name" placeholder="👤 Full Name" value={formData.name} onChange={handleChange} required />
                <input name="email" type="email" placeholder="📧 Email" value={formData.email} onChange={handleChange} required />
                <input name="age" type="number" placeholder="🎂 Age" value={formData.age} onChange={handleChange} required />
              <select style={{
  
  height: "25px",
  marginBottom:"1rem" 

}}
  name="course"
  value={formData.course}
  onChange={handleChange}
  required
>
  <option value="BSCS">BSCS</option>
  <option value="BSSE">BSSE</option>
  <option value="BSAI">BSAI</option>
  <option value="BBA">BBA</option>
  <option value="BSIT">BSIT</option>
  <option value="Dpharm">Dpharm</option>
</select>
                <button type="submit">Add Student</button>
              </form>
            </section>
          ) : (
            <section className="list-section">
              {students.length === 0 ? (
                <p className="empty">No students found yet.</p>
              ) : (
                <div className="student-list">
                {students.map((student) => (
  <div key={student._id} className="student-card">
    <h3>{student.name}</h3>
    <p>📧 {student.email}</p>
    <p>🎓 {student.course}</p>
    <p>🎂 {student.age} years old</p>
    <button
      onClick={() => deleteStudent(student._id)}
      className="delete-button"
      style={{ marginTop: '10px', backgroundColor: '#f44336', color: 'white', cursor:'pointer' }}
    >
      🗑 Delete
    </button>
  </div>
))}

                  
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </>
  );
}
