import React, { useState, useEffect } from 'react';
import { Trophy, Heart } from 'lucide-react';
import type { Photo } from '../types';

interface TopMomentsProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

const TopMoments: React.FC<TopMomentsProps> = ({ photos, onPhotoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get top 6 most liked photos
  const topPhotos = photos
    .sort((a, b) => b.likes_count - a.likes_count)
    .slice(0, 6);

  useEffect(() => {
    if (topPhotos.length > 3) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % Math.max(1, topPhotos.length - 2));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [topPhotos.length]);

  if (topPhotos.length === 0) {
    return (
      <section className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-[#ead1b9]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#ab7951] mb-4 flex items-center justify-center gap-2">
            🏆 Momenti Top
            <Trophy className="w-8 h-8 text-yellow-500" />
          </h2>
          <p className="text-[#cba281] text-lg italic">
            Carica le tue foto per vedere i momenti più amati!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-[#ead1b9]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#ab7951] mb-2 flex items-center justify-center gap-2">
          🏆 Momenti Top
          <Trophy className="w-8 h-8 text-yellow-500" />
        </h2>
        <p className="text-[#cba281] text-lg">Hall of Fame - Le foto più amate</p>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100/3)}%)` }}
        >
          {topPhotos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="w-1/3 flex-shrink-0 px-2"
            >
              <div 
                className="relative group cursor-pointer"
                onClick={() => onPhotoClick(photo)}
              >
                {photo.file_type === 'video' ? (
                  <video
                    src={photo.url}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300"
                    muted
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <img
                    src={photo.url}
                    alt={`Top moment ${index + 1}`}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Media Type Indicator */}
                {photo.file_type === 'video' && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold">
                    🎥
                  </div>
                )}
                
                {/* Ranking Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                  #{index + 1}
                </div>
                
                {/* Likes Count */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1 shadow-lg">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  <span className="font-semibold text-sm text-[#ab7951]">{photo.likes_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      {topPhotos.length > 3 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.max(1, topPhotos.length - 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-[#cba281] scale-125' 
                  : 'bg-[#ead1b9] hover:bg-[#cba281]'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TopMoments;