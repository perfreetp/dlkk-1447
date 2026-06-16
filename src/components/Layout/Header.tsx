import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, User, Sparkles, History, Plus } from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import { getCities } from '@/data/cities';

export default function Header() {
  const navigate = useNavigate();
  const { currentCity, setCurrentCity } = useBoxStore();
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cities = getCities();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary-500/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center glow-hover">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text font-display">闪拼盒</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-dark-300 hover:text-white transition-colors text-sm">拼盒大厅</Link>
            <Link to="/history" className="text-dark-300 hover:text-white transition-colors text-sm flex items-center gap-1">
              <History className="w-4 h-4" />
              历史战绩
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-1.5 text-sm text-dark-200 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <MapPin className="w-4 h-4 text-neon-purple" />
              <span>{currentCity}</span>
            </button>
            
            {showCityDropdown && (
              <div className="absolute top-full left-0 mt-2 w-32 glass rounded-xl py-2 shadow-xl animate-scale-in">
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setCurrentCity(city);
                      setShowCityDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${
                      city === currentCity ? 'text-neon-purple' : 'text-dark-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/create')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white text-sm font-medium glow-hover transition-all"
          >
            <Plus className="w-4 h-4" />
            发起拼盒
          </button>

          <button className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center hover:bg-dark-600 transition-colors">
            <User className="w-5 h-5 text-dark-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
