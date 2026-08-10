'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  async function loadRestaurants() {
    setLoading(true);
    const { data } = await supabase
      .from('restaurants')
      .select('*, reviews(taste_score)')
      .order('created_at', { ascending: false });
    setRestaurants(data || []);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    loadRestaurants();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');

    if (!session) {
      setError('Log in first to add a restaurant.');
      return;
    }

    const { error: insertError } = await supabase.from('restaurants').insert({
      name,
      area,
      category,
      created_by: session.user.id,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setName('');
    setArea('');
    setCategory('');
    setShowForm(false);
    loadRestaurants();
  }

  function avgTaste(r) {
    if (!r.reviews || r.reviews.length === 0) return null;
    const sum = r.reviews.reduce((acc, rev) => acc + (rev.taste_score || 0), 0);
    return (sum / r.reviews.length).toFixed(1);
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-deshiRed">Explore Restaurants</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-deshiGreen text-white px-5 py-2 rounded-full font-semibold hover:bg-emerald-800 transition"
        >
          {showForm ? 'Cancel' : '+ Add Restaurant'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            required
            placeholder="Name (e.g. Sultan's Dine)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="text"
            placeholder="Area (e.g. Dhanmondi)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="text"
            placeholder="Category (e.g. Kacchi Biryani)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          {error && <p className="text-deshiRed text-sm md:col-span-3">{error}</p>}
          <button
            type="submit"
            className="md:col-span-3 bg-deshiRed text-white py-2 rounded-full font-bold hover:bg-red-700 transition"
          >
            Save Restaurant
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading restaurants…</p>
      ) : restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants yet — be the first to add one.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {restaurants.map((r) => (
            <Link
              key={r.id}
              href={`/restaurants/${r.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden w-64 border border-gray-200 hover:shadow-lg transition block"
            >
              <div className="h-24 bg-gray-200 flex items-center justify-center text-3xl">🍽️</div>
              <div className="p-4">
                <h4 className="font-bold text-lg">{r.name}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  {r.area || 'Dhaka'} {r.category ? `• ${r.category}` : ''}
                </p>
                <span className="bg-deshiGreen text-white text-xs px-2 py-1 rounded">
                  {avgTaste(r) ? `Avg: ${avgTaste(r)}/10` : 'No reviews yet'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
