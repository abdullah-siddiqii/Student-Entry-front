'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import NavbarL from '../components/dashboard/NavbarL';
import './Login.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password } = formData;

    // Manual validation
    if (!email || !password) {
      toast.error('⚠️ Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success('✅ Login successful!');
        router.push('/home');
      } else {
        toast.error(result.message || '❌ Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('🚨 Server error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarL />
      <main className="login-main">
        <div className="login-box">
          <h4 className="login-title">🔐 Login to Dashboard</h4>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              name="email"
              placeholder="📧 Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="🔑 Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? '⏳ Logging in...' : '➡️ Login'}
            </button>
          </form>
        </div>

        <div>
          <img src="/images/Login.png" alt="Login illustration" className="Deep" />
        </div>
      </main>
    </>
  );
}
