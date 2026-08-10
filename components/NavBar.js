'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function NavBar() {
  const [session, setSession] = useState(null);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setDisplayName('');
      return;
    }
    supabase
      .from('profiles')
      .select('display_name')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setDisplayName(data?.display_name || session.user.email));
  }, [session]);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <nav className="bg-deshiGreen text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wider">
          ☕ বৈঠক (Baithak)
        </Link>
        <div className="space-x-4 font-semibold flex items-center">
          <Link href="/restaurants" className="hover:text-deshiYellow transition">
            Explore
          </Link>
          {session ? (
            <>
              <span className="text-deshiYellow">Hi, {displayName}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-deshiGreen px-4 py-2 rounded-full hover:bg-gray-100 transition"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-deshiYellow transition">
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-deshiYellow text-gray-900 px-4 py-2 rounded-full hover:bg-yellow-500 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
