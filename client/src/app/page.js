// src/app/page.js - Landing Page
'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { warmupBackend } from './services/authService';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Warm up the backend service when the app loads
    warmupBackend();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Welcome to Go-Next-Chat</h1>
        <p className="text-gray-600 text-center mb-8">
          Connect with friends and colleagues in real-time with our secure messaging platform.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push('/register')}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}