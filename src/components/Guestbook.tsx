import React, { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { GuestbookEntry } from '../types';

const Guestbook: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ username: '', message: '' });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % entries.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [entries.length]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('guestbook_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching guestbook entries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.username.trim() || !newEntry.message.trim()) return;

    try {
      const { data, error } = await supabase
        .from('guestbook_entries')
        .insert([newEntry])
        .select()
        .single();

      if (error) throw error;
      
      setEntries(prev => [data, ...prev]);
      setNewEntry({ username: '', message: '' });
    } catch (error) {
      console.error('Error adding guestbook entry:', error);
    }
  };

  return (
    <section className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-[#ead1b9]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#ab7951] mb-2 flex items-center justify-center gap-2">
          🎁 Guestbook Digitale
          <MessageCircle className="w-8 h-8" />
        </h2>
        <p className="text-[#cba281]">Lascia un messaggio di auguri che resterà per sempre!</p>
      </div>

      {/* Carousel of Messages */}
      <div className="mb-6 h-20 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f4caa3] to-[#ead1b9] p-4">
        {entries.length > 0 ? (
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {entries.map((entry, index) => (
              <div key={entry.id} className="w-full flex-shrink-0 text-center">
                <p className="text-[#ab7951] font-medium italic mb-1">
                  "{entry.message}"
                </p>
                <p className="text-[#cba281] font-semibold text-sm">
                  - {entry.username}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#ab7951] italic">
            <p className="text-sm">Nessun messaggio ancora... sii il primo a lasciare un augurio!</p>
          </div>
        )}
      </div>

      {/* Add New Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Il tuo nome"
            value={newEntry.username}
            onChange={(e) => setNewEntry(prev => ({ ...prev, username: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border-2 border-[#ead1b9] focus:border-[#cba281] focus:ring-2 focus:ring-[#cba281] focus:ring-opacity-20 transition-all duration-200 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Il tuo messaggio di auguri"
            value={newEntry.message}
            onChange={(e) => setNewEntry(prev => ({ ...prev, message: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border-2 border-[#ead1b9] focus:border-[#cba281] focus:ring-2 focus:ring-[#cba281] focus:ring-opacity-20 transition-all duration-200 text-sm"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#cba281] to-[#ab7951] text-white py-2 px-4 rounded-xl font-semibold hover:from-[#ab7951] hover:to-[#cba281] transform hover:scale-[1.02] transition-all duration-200 shadow-lg flex items-center justify-center gap-2 text-sm"
        >
          <Send className="w-5 h-5" />
          Lascia il tuo augurio
        </button>
      </form>
    </section>
  );
};

export default Guestbook;