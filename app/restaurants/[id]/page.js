'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [tasteScore, setTasteScore] = useState(8);
  const [vibeScore, setVibeScore] = useState(8);
  const [priceTier, setPriceTier] = useState('Motamuti');
  const [notes, setNotes] = useState('');

  async function loadData() {
    setLoading(true);
    const { data: restaurantData } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    setRestaurant(restaurantData);

    const { data: reviewData } = await supabase
      .from('reviews')
      .select('*, profiles(display_name)')
      .eq('restaurant_id', id)
      .order('created_at', { ascending: false });
    setReviews(reviewData || []);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    if (id) loadData();
  }, [id]);

  async function handleAddReview(e) {
    e.preventDefault();
    setError('');

    if (!session) {
      setError('Log in first to leave a review.');
      return;
    }

    const { error: insertError } = await supabase.from('reviews').insert({
      user_id: session.user.id,
      restaurant_id: id,
      taste_score: tasteScore,
      vibe_score: vibeScore,
      price_tier: priceTier,
      notes,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setNotes('');
    loadData();
  }

  if (loading) return <p className="max-w-3xl mx-auto mt-12 px-4 text-gray-500">Loading…</p>;
  if (!restaurant)
    return <p className="max-w-3xl mx-auto mt-12 px-4 text-gray-500">Restaurant not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4 mb-16">
      <h2 className="text-3xl font-extrabold text-deshiRed mb-1">{restaurant.name}</h2>
      <p className="text-gray-500 mb-8">
        {restaurant.area || 'Dhaka'} {restaurant.category ? `• ${restaurant.category}` : ''}
      </p>

      <form onSubmit={handleAddReview} className="bg-white p-6 rounded-xl shadow-sm mb-10 space-y-4">
        <h3 className="text-xl font-bold">Leave a review</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1">Taste (1-10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={tasteScore}
              onChange={(e) => setTasteScore(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Adda Vibe (1-10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={vibeScore}
              onChange={(e) => setVibeScore(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Price</label>
            <select
              value={priceTier}
              onChange={(e) => setPriceTier(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="Sosta">Sosta (Cheap)</option>
              <option value="Motamuti">Motamuti (Mid)</option>
              <option value="Dam">Dam (Expensive)</option>
            </select>
          </div>
        </div>
        <textarea
          placeholder="Notes — how was it?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          rows={3}
        />
        {error && <p className="text-deshiRed text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-deshiRed text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition"
        >
          Submit Review
        </button>
      </form>

      <h3 className="text-xl font-bold mb-4">
        Reviews {reviews.length > 0 && `(${reviews.length})`}
      </h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet — be the first.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{r.profiles?.display_name || 'Anonymous'}</span>
                <span className="bg-deshiGreen text-white text-xs px-2 py-1 rounded">
                  Taste {r.taste_score}/10 • Vibe {r.vibe_score}/10 • {r.price_tier}
                </span>
              </div>
              {r.notes && <p className="text-gray-600">{r.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
