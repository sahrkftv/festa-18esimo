import React from 'react';
import { Camera, Heart, MessageCircle } from 'lucide-react';
import type { Photo } from '../types';

interface PhotoGalleryProps {
  photos: Photo[];
  loading: boolean;
  onPhotoClick: (photo: Photo) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, loading, onPhotoClick }) => {
  if (loading) {
    return (
      <section className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-[#ead1b9]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#ab7951] mb-4 flex items-center justify-center gap-2">
            ✨ Scorri la galleria
            <Camera className="w-8 h-8" />
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cba281]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-[#ead1b9]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#ab7951] mb-2 flex items-center justify-center gap-2">
          ✨ Scorri la galleria
          <Camera className="w-8 h-8" />
        </h2>
        <p className="text-[#cba281] text-lg">Rivivi i momenti più belli attraverso foto e video di tutti</p>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-[#ead1b9] mx-auto mb-4" />
          <p className="text-[#cba281] text-xl italic">
            Nessun contenuto caricato ancora... sii il primo a condividere un ricordo!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group cursor-pointer"
              onClick={() => onPhotoClick(photo)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                {photo.file_type === 'video' ? (
                  <video
                    src={photo.url}
                    className="w-full h-64 object-cover"
                    muted
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <img
                    src={photo.url}
                    alt={`Foto di ${photo.uploaded_by}`}
                    className="w-full h-64 object-cover"
                  />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Media Type Indicator */}
                {photo.file_type === 'video' && (
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold">
                    🎥 VIDEO
                  </div>
                )}
                
                {/* Photo Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-semibold text-sm mb-2">
                    {photo.file_type === 'video' ? '🎥' : '📷'} {photo.uploaded_by}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-sm">{photo.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">Commenta</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;