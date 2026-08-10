'use client';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Calendar, MapPin, Users, LogOut, Plus, Clock } from 'lucide-react';

export default function BaithakWeb() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  
  // Auth State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard State
  const [myBaithaks, setMyBaithaks] = useState([]);
  const [myInvites, setMyInvites] = useState([]);
  
  // New Baithak Form
  const [restaurant, setRestaurant] = useState('');
  const [date, setDate] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');

  // 1. Session Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setStep(3);
        fetchDashboardData(session.user);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setStep(3);
        fetchDashboardData(session.user);
      } else {
        setStep(1);
        setProfile(null);
      }
    });
  }, []);

  // 2. Fetch Data (Triggered on login)
  const fetchDashboardData = async (user) => {
    // Get User Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (profileData) setProfile(profileData);

    // Get Baithaks you are hosting
    const { data: baithaksData } = await supabase
      .from('baithaks')
      .select('*, baithak_invites(invited_email, status)')
      .eq('host_id', user.id)
      .order('scheduled_at', { ascending: true });
    if (baithaksData) setMyBaithaks(baithaksData);

    // Get your incoming invitations
    const { data: invitesData } = await supabase
      .from('baithak_invites')
      .select('*, baithaks(restaurant_name, scheduled_at, profiles(full_name))')
      .eq('invited_email', user.email);
    if (invitesData) setMyInvites(invitesData);
  };

  // 3. Auth Actions
  const handleSendOtp = async () => {
    setIsLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { data: { name: name } }
    });
    if (error) setError(error.message);
    else setStep(2);
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError('');
    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'email'
    });
    if (error) setError("Invalid code. Please try again.");
    setIsLoading(false);
  };

  // 4. Database Actions
  const handleCreateBaithak = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Insert Baithak
    const { data: newBaithak, error: bError } = await supabase
      .from('baithaks')
      .insert([{ 
        host_id: session.user.id, 
        restaurant_name: restaurant, 
        scheduled_at: date 
      }])
      .select()
      .single();

    if (bError) {
      setError(bError.message);
      setIsLoading(false);
      return;
    }

    // Insert Invite if an email was provided
    if (inviteeEmail) {
      await supabase
        .from('baithak_invites')
        .insert([{
          baithak_id: newBaithak.id,
          invited_email: inviteeEmail
        }]);
    }

    // Reset form and refresh dashboard
    setRestaurant('');
    setDate('');
    setInviteeEmail('');
    fetchDashboardData(session.user);
    setIsLoading(false);
  };

  const updateInviteStatus = async (inviteId, newStatus) => {
    await supabase
      .from('baithak_invites')
      .update({ status: newStatus })
      .eq('id', inviteId);
    fetchDashboardData(session.user);
  };

  // --- RENDER LOGIC ---

  // Dashboard View
  if (step === 3 && profile) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200 mt-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Baithak</h1>
            <p className="text-gray-500">Welcome back, {profile.full_name}</p>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
            <LogOut size={18} className="mr-2" /> Sign Out
          </button>
        </header>

        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Column 1: Create Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Plus className="mr-2 text-indigo-600" /> Plan a Baithak
            </h2>
            <form onSubmit={handleCreateBaithak} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input required type="text" placeholder="e.g., Khao San, Gulshan" value={restaurant} onChange={(e) => setRestaurant(e.target.value)} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input required type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invite Friend (Email)</label>
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input type="email" placeholder="friend@example.com" value={inviteeEmail} onChange={(e) => setInviteeEmail(e.target.value)} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <button disabled={isLoading} type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                {isLoading ? 'Scheduling...' : 'Schedule Hangout'}
              </button>
            </form>
          </div>

          {/* Column 2: Activity Feed */}
          <div className="space-y-8">
            
            {/* Incoming Invites */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="mr-2 text-indigo-600" /> My Invitations
              </h2>
              {myInvites.length === 0 ? (
                <p className="text-gray-500 text-sm">No pending invites.</p>
              ) : (
                <div className="space-y-3">
                  {myInvites.map(invite => (
                    <div key={invite.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-900">{invite.baithaks.restaurant_name}</h3>
                      <p className="text-sm text-gray-500 mb-3">Host: {invite.baithaks.profiles.full_name} • {new Date(invite.baithaks.scheduled_at).toLocaleString()}</p>
                      
                      {invite.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => updateInviteStatus(invite.id, 'accepted')} className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-md font-medium hover:bg-green-200">Accept</button>
                          <button onClick={() => updateInviteStatus(invite.id, 'declined')} className="px-4 py-2 bg-red-100 text-red-700 text-sm rounded-md font-medium hover:bg-red-200">Decline</button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${invite.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Hosted Events */}
            <div>
              <h2 className="text-xl font-bold mb-4">Hosted by Me</h2>
              {myBaithaks.length === 0 ? (
                <p className="text-gray-500 text-sm">You haven't scheduled any baithaks yet.</p>
              ) : (
                <div className="space-y-3">
                  {myBaithaks.map(baithak => (
                    <div key={baithak.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-900">{baithak.restaurant_name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{new Date(baithak.scheduled_at).toLocaleString()}</p>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Invited Guests:</p>
                        {baithak.baithak_invites.length > 0 ? baithak.baithak_invites.map((inv, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm mt-1">
                            <span className="text-gray-700">{inv.invited_email}</span>
                            <span className={`text-xs font-medium ${inv.status === 'accepted' ? 'text-green-600' : inv.status === 'declined' ? 'text-red-600' : 'text-orange-500'}`}>{inv.status}</span>
                          </div>
                        )) : <p className="text-xs text-gray-400">No guests invited yet.</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  // Auth UI (Steps 1 & 2)
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-900">Log in to Baithak</h2>
        
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Name</label>
              <input type="text" placeholder="e.g., Sol" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" placeholder="sol@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button onClick={handleSendOtp} disabled={isLoading || !name || !email.includes('@')} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors">
              {isLoading ? 'Sending...' : 'Send Login Code'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check Your Email</label>
              <input type="text" placeholder="Enter 6-Digit Code" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center tracking-widest text-lg" />
            </div>
            <button onClick={handleVerifyOtp} disabled={isLoading || otp.length < 6} className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-green-300 transition-colors">
              {isLoading ? 'Verifying...' : 'Log into Baithak'}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-indigo-600 mt-2">
              Back to email input
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-4 text-center bg-red-50 p-2 rounded">{error}</p>}
      </div>
    </div>
  );
}
