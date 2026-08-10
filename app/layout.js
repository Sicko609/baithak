import './globals.css';
import NavBar from '../components/NavBar';

export const metadata = {
  title: 'Baithak | Track Food, Schedule Adda',
  description:
    'The ultimate food and social map for Bangladesh — track restaurants, rate deshi food, and schedule adda with friends.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-juteBg text-gray-800">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
