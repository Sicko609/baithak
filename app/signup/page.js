'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push('/restaurants');
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h2 className="text-3xl font-extrabold text-deshiRed mb-6 text-center">
        Join Baithak
      </h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <div>
          <label className="block font-semibold mb-1">Display name</label>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Foodie Dhaka"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="At least 6 characters"
          />
        </div>
        {error && <p className="text-deshiRed text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-deshiRed text-white py-2 rounded-full font-bold hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center mt-4 text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-deshiGreen font-semibold">
          Log in
        </Link>
      </p>
    </div>
  );
}
