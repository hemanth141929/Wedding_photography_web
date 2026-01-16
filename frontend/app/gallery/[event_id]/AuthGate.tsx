'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';

export default function AuthGate({ event_id, children }: { event_id: string, children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authData = JSON.parse(localStorage.getItem('unlocked_galleries') || '{}');
      const session = authData[event_id];

      if (session) {
        const now = new Date().getTime();
        const oneHour = 60 * 60 * 1000;

        if (now - session.timestamp > oneHour) {
          delete authData[event_id];
          localStorage.setItem('unlocked_galleries', JSON.stringify(authData));
          setIsUnlocked(false);
        } else {
          setIsUnlocked(true);
        }
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 10000);
    return () => clearInterval(interval);
  }, [event_id]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from('events')
        .select('id')
        .eq('id', event_id)
        .eq('contact', phoneNumber)
        .eq('password', password)
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        setError('System Error. Please try again.');
        return;
      }

      if (data) {
        const authData = JSON.parse(localStorage.getItem('unlocked_galleries') || '{}');
        
        authData[event_id] = {
          unlocked: true,
          timestamp: new Date().getTime()
        };

        localStorage.setItem('unlocked_galleries', JSON.stringify(authData));
        setIsUnlocked(true);
      } else {
        setError('Invalid Phone Number or Password.');
      }
    } catch (err) {
      setError('System Error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isUnlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3ca8c] via-[#ecd0a5] to-[#f0e1d7] flex flex-col items-center justify-center px-6 selection:bg-pink-300/30">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-8 md:p-12">
          <div className="text-center mb-8">
            <span className="text-[#7e4700] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">
              Secure Access
            </span>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase text-gray-800 mb-4 tracking-tighter font-['Playfair_Display']">
              Client Login
            </h1>
            <p className="text-brown-medium text-sm">Enter your credentials to access the gallery</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="PHONE NUMBER"
                className="w-full bg-white border-2 border-brown-warm focus:border-brown-light px-6 py-4 text-gray-800 text-center tracking-[0.2em] outline-none transition-all placeholder:text-brown-light rounded-xl"
                required
              />
              <input 
                type="text" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="EVENT PASSWORD"
                className="w-full bg-white border-2 border-brown-warm focus:border-brown-light px-6 py-4 text-gray-800 text-center tracking-[0.2em] outline-none transition-all placeholder:text-brown-light uppercase rounded-xl"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-[10px] uppercase tracking-widest text-center">
                  {error}
                </p>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-brown-medium hover:bg-brown-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 tracking-[0.3em] uppercase text-xs transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {loading ? 'Verifying...' : 'Access Gallery'}
            </button>
            
            <p className="text-[9px] uppercase tracking-[0.2em] mt-6 text-center">
              Note: Session expires after 1 minute of inactivity.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}