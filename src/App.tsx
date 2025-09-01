import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Guestbook from './components/Guestbook';
import TopMoments from './components/TopMoments';
import PhotoUpload from './components/PhotoUpload';
import PhotoGallery from './components/PhotoGallery';
import PhotoModal from './components/PhotoModal';
import { supabase } from './lib/supabase';
import type { Photo } from './types';

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (newPhoto: Photo) => {
    setPhotos(prev => [newPhoto, ...prev]);
  };

  const handleLike = async (photoId: string) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;

      const { error } = await supabase
        .from('photos')
        .update({ likes_count: photo.likes_count + 1 })
        .eq('id', photoId);

      if (error) throw error;

      setPhotos(prev => prev.map(p => 
        p.id === photoId ? { ...p, likes_count: p.likes_count + 1 } : p
      ));

      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto({ ...selectedPhoto, likes_count: selectedPhoto.likes_count + 1 });
      }
    } catch (error) {
      console.error('Error liking photo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4caa3] to-[#ead1b9]">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        <Guestbook />
        <TopMoments photos={photos} onPhotoClick={setSelectedPhoto} />
        <PhotoUpload onPhotoUpload={handlePhotoUpload} />
        <PhotoGallery 
          photos={photos} 
          loading={loading}
          onPhotoClick={setSelectedPhoto}
        />
      </main>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onLike={handleLike}
        />
      )}
    </div>
  );
}

export default App;