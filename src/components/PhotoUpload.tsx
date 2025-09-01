import React, { useState } from 'react';
import { Camera, Upload, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Photo } from '../types';

interface PhotoUploadProps {
  onPhotoUpload: (photo: Photo) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !username.trim()) {
      alert('Per favore inserisci il tuo nome prima di caricare una foto');
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Save photo metadata to database
      const { data, error } = await supabase
        .from('photos')
        .insert([{
          url: publicUrl,
          file_type: fileType,
          uploaded_by: username.trim(),
          likes_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      onPhotoUpload(data);
      setUsername('');
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Errore nel caricamento della foto. Riprova.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-[#ead1b9]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#ab7951] mb-2 flex items-center justify-center gap-2">
          📸 Carica le tue foto
          <Camera className="w-8 h-8" />
        </h2>
        <p className="text-[#cba281] text-lg">Aggiungi i tuoi ricordi alla collezione</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          placeholder="Il tuo nome"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-[#ead1b9] focus:border-[#cba281] focus:ring-2 focus:ring-[#cba281] focus:ring-opacity-20 transition-all duration-200"
          required
        />

        <label className="block">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            disabled={uploading || !username.trim()}
            className="hidden"
          />
          <div className={`
            w-full py-6 px-8 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center
            ${uploading || !username.trim() 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
              : 'border-[#cba281] bg-gradient-to-br from-[#f4caa3] to-[#ead1b9] hover:from-[#ead1b9] hover:to-[#f4caa3] hover:scale-[1.02] shadow-lg hover:shadow-xl'
            }
          `}>
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-[#ab7951]">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ab7951]"></div>
                Caricamento in corso...
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#ab7951]">
                <div className="flex items-center gap-2">
                  <Upload className="w-6 h-6" />
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-semibold text-lg">
                  {username.trim() ? 'Scegli foto o video dalla galleria' : 'Inserisci prima il tuo nome'}
                </span>
              </div>
            )}
          </div>
        </label>
      </div>
    </section>
  );
};

export default PhotoUpload;