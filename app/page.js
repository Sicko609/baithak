import Link from 'next/link';

const features = [
  {
    title: '📍 Rate & Rank',
    body: "Compare Star Kabab to Sultan's Dine. Build your personal leaderboard of the best deshi food in town.",
    border: 'border-deshiRed',
  },
  {
    title: '📅 Schedule an Adda',
    body: "Send invites to your friends for tea at TSC or a heavy dinner at Dhanmondi. We'll handle the tracking.",
    border: 'border-deshiYellow',
  },
  {
    title: '🏆 Hall of Fame',
    body: "Earn badges like 'Cha-Khor' or 'Biryani Boss' based on your eating streaks and reviews.",
    border: 'border-deshiGreen',
  },
];

export default function Home() {
  return (
    <>
      <header className="max-w-6xl mx-auto mt-12 px-4 text-center">
        <h2 className="text-5xl font-extrabold text-deshiRed mb-4">
          Never Forget a Good Adda Spot.
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track every Kacchi joint, rate the best street Fuchka, and schedule hangouts with your
          friends. The ultimate food and social map for Bangladesh.
        </p>
        <Link
          href="/restaurants"
          className="inline-block bg-deshiRed text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-red-700 transition"
        >
          Start Your Food Map
        </Link>
      </header>

      <section className="max-w-6xl mx-auto mt-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((f) => (
          <div
            key={f.title}
            className={`bg-white p-6 rounded-xl shadow-sm border-t-4 ${f.border}`}
          >
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
