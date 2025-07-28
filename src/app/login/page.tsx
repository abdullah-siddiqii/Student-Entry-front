'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './Login.css';
import toast from 'react-hot-toast';
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        router.push('/dashboard');
        toast.success("Login Success")
      } else {
        setMessage(result.message || 'Login failed');
        toast.error("Login Failed")
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  return (
    <main className="login-main">
      <div className="login-box">
        <h1 className="login-title">🔐 Login to Dashboard</h1>

        {message && <div className="login-message">{message}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="🔑 Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </main>
  );
}
