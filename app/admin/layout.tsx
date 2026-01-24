'use client';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState('');

  // Check session storage on load to persist login across refreshes
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('admin_auth');
    if (sessionAuth === 'true') setIsAuthorized(true);
  }, []);

  const handleLogin = async () => {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      body: JSON.stringify({ code: inputCode })
    });
    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthorized(true);
    } else {
      alert('Incorrect Passcode');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter Passcode"
            className="w-full p-2 border border-slate-300 rounded mb-4"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button 
            onClick={handleLogin}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded transition"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
