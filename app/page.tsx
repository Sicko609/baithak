'use client';
import { useState } from 'react';

export default function BaithakApp() {
  const [activeTab, setActiveTab] = useState('explore');

  const restaurants = [
    { name: 'Khao San', area: 'Dhaka', category: 'Thai', rating: 9.1, reviews: 342, icon: '🍜' },
    { name: 'Arrowhead Grill', area: 'Dhaka', category: 'Steak/Grill', rating: 9.4, reviews: 215, icon: '🥩' },
    { name: 'Turkish Kebab Pizza', area: 'Dhaka', category: 'Fast Food', rating: 8.8, reviews: 512, icon: '🍕' }
  ];

  return (
    <div className="min-h-screen font-sans text-gray-900 pb-20 relative">
      
      {/* Dynamic Header with Gradient */}
      <header className="bg-gradient-to-r from-deshiGreen via-teal-700 to-deshiGreen text-white p-5 sticky top-0 z-20 shadow-lg flex justify-between items-center rounded-b-2xl">
        <h1 className="text-3xl font-bold tracking-wider drop-shadow-md">☕ বৈঠক</h1>
        <div className="flex items-center space-x-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
          <span className="text-sm font-bold shadow-sm">🔥 Streak: 12</span>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 mt-6">
        
        {/* TAB 1: Explore Feed */}
        {activeTab === 'explore' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Trending Adda Spots</h2>
              <span className="text-sm text-deshiRed font-bold animate-pulse">Live 🔥</span>
            </div>
            
            <div className="space-y-5">
              {restaurants.map((place, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl drop-shadow-sm">{place.icon}</div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{place.name}</h3>
                      <p className="text-sm text-gray-600 font-medium">{place.area} • {place.category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-gradient-to-br from-deshiYellow to-orange-500 text-white text-sm px-3 py-1 rounded-lg font-bold shadow-sm mb-1">
                      {place.rating}
                    </div>
                    <div className="text-xs text-gray-500 font-semibold">{place.reviews} revs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Schedule an Adda */}
        {activeTab === 'schedule' && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Plan an Adda</h2>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border-t-8 border-deshiRed">
              
              <div className="text-center mb-6 text-4xl animate-bounce-slow">📅</div>

              <label className="block text-sm font-bold text-gray-700 mb-2">কোথায় যাবেন? (Where to?)</label>
              <select className="w-full bg-white border-2 border-gray-100 rounded-xl p-3 mb-5 shadow-sm focus:border-deshiYellow focus:ring-0 transition">
                {restaurants.map((place, idx) => <option key={idx}>{place.name}</option>)}
              </select>

              <label className="block text-sm font-bold text-gray-700 mb-2">কখন? (When?)</label>
              <input type="datetime-local" className="w-full bg-white border-2 border-gray-100 rounded-xl p-3 mb-8 shadow-sm focus:border-deshiYellow transition" />

              <button className="w-full bg-gradient-to-r from-deshiRed to-red-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-red-500/50 hover:scale-[1.02] transition-all duration-300">
                Send Invites 🚀
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: User Profile */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
            
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/50 text-center relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-deshiYellow rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-deshiRed rounded-full blur-3xl opacity-20"></div>

              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner relative z-10 border-4 border-white">
                👨🏽‍💻
              </div>
              <h3 className="font-bold text-2xl text-gray-900 relative z-10">Sol Songlap</h3>
              <p className="text-gray-500 font-medium mb-6 relative z-10">Dhaka Foodie</p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-2 relative z-10">
                <span className="bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 px-4 py-1.5 rounded-full font-bold shadow-sm border border-yellow-200 text-sm">🏆 Biryani Boss</span>
                <span className="bg-gradient-to-r from-green-100 to-green-50 text-green-800 px-4 py-1.5 rounded-full font-bold shadow-sm border border-green-200 text-sm">☕ Cha-Khor</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Mobile Navigation (Glassmorphic) */}
      <nav className="fixed bottom-4 w-[95%] max-w-md bg-white/90 backdrop-blur-lg border border-white/40 rounded-3xl flex justify-around p-2 left-1/2 -translate-x-1/2 shadow-2xl z-50">
        <button onClick={() => setActiveTab('explore')} className={`flex flex-col items-center p-3 w-20 rounded-2xl transition-all duration-300 ${activeTab === 'explore' ? 'bg-red-50 text-deshiRed scale-105' : 'text-gray-400 hover:bg-gray-50'}`}>
          <span className="text-2xl mb-1 drop-shadow-sm">🌍</span>
          <span className="text-xs font-bold">Explore</span>
        </button>
        <button onClick={() => setActiveTab('schedule')} className={`flex flex-col items-center p-3 w-20 rounded-2xl transition-all duration-300 ${activeTab === 'schedule' ? 'bg-yellow-50 text-deshiYellow scale-105' : 'text-gray-400 hover:bg-gray-50'}`}>
          <span className="text-2xl mb-1 drop-shadow-sm">📅</span>
          <span className="text-xs font-bold">Adda</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center p-3 w-20 rounded-2xl transition-all duration-300 ${activeTab === 'profile' ? 'bg-green-50 text-deshiGreen scale-105' : 'text-gray-400 hover:bg-gray-50'}`}>
          <span className="text-2xl mb-1 drop-shadow-sm">👤</span>
          <span className="text-xs font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
}
