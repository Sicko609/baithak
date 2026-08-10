'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function BaithakWeb() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
  const [step, setStep] = useState(1); // 1: Input, 2: OTP, 3: Success
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Request the Email OTP
  const handleSendOtp = async () => {
    setIsLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        data: { name: name } // Triggers the SQL to save their name
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setStep(2);
    }
    setIsLoading(false);
  };

  // 2. Verify the OTP
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError('');

    const { data: { session }, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'email'
    });

    if (error) {
      setError("Invalid code. Please try again.");
    } else if (session) {
      setStep(3);
    }
    setIsLoading(false);
  };

  // 3. Logged-in State (Home View)
  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <h1 className="text-3xl font-bold text-indigo-900 mb-4">
          Welcome to your first Baithak, {name}!
        </h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Ready to invite friends to Khao San or Brew Buddies Limited? Create a new hangout to get started.
        </p>
        <button 
          onClick={() => supabase.auth.signOut().then(() => setStep(1))}
          className="text-sm text-red-500 underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  // Auth UI (Steps 1 & 2)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Log in to Baithak</h2>
        
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Name</label>
              <input 
                type="text" 
                placeholder="e.g., Sol Songlap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="sol@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button 
              onClick={handleSendOtp}
              disabled={isLoading || !name || !email.includes('@')}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send Login Code'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check Your Email</label>
              <input 
                type="text" 
                placeholder="Enter 6-Digit Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center tracking-widest text-lg"
              />
            </div>
            
            <button 
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length < 6}
              className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-green-300 transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Log into Baithak'}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
