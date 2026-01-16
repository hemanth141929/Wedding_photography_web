import Navbar from './component/Navbar';
import HeroSlider from './component/HeroSlider';

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-[#f3ca8c] via-[#ecd0a5] to-[#f0e1d7] min-h-screen selection:bg-pink-300/30">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-20 pb-20">
        <div className="w-full max-w-7xl mx-auto px-4">
          <HeroSlider />
        </div>
      </div>
    </main>
  );
}