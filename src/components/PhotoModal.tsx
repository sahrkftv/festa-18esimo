import React, { useState, useEffect } from 'react';
import { X, Heart, Send, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Photo, Comment } from '../types';

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
  onLike: (photoId: string) => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose, onLike }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ username: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [photo.id]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('photo_id', photo.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.username.trim() || !newComment.comment.trim()) return;

    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          photo_id: photo.id,
          username: newComment.username.trim(),
          comment: newComment.comment.trim()
        }])
        .select()
        .single();

      if (error) throw error;
      
      setComments(prev => [...prev, data]);
      setNewComment({ username: '', comment: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Photo Section */}
          <div className="lg:w-2/3 relative bg-black flex items-center justify-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-colors duration-200 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {photo.file_type === 'video' ? (
              <video
                src={photo.url}
                controls
                autoPlay
                loop
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <img
                src={photo.url}
                alt={`Foto di ${photo.uploaded_by}`}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {/* Comments Section */}
          <div className="lg:w-1/3 flex flex-col bg-gradient-to-b from-[#f4caa3] to-[#ead1b9]">
            {/* Photo Info Header */}
            <div className="p-6 border-b border-[#cba281]/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[#ab7951]">
                    {photo.file_type === 'video' ? '🎥' : '📷'} {photo.uploaded_by}
                  </h3>
                  <p className="text-sm text-[#cba281]">
                    {new Date(photo.created_at).toLocaleDateString('it-IT')}
                  </p>
                </div>
                <button
                  onClick={() => onLike(photo.id)}
                  className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/70 transition-all duration-200 group"
                >
                  <Heart className="w-5 h-5 text-red-500 group-hover:fill-red-500 transition-all duration-200" />
                  <span className="font-semibold text-[#ab7951]">{photo.likes_count}</span>
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center text-[#ab7951] italic py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  Nessun commento ancora... sii il primo!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-[#ab7951]">{comment.username}</span>
                      <span className="text-xs text-[#cba281]">
                        {new Date(comment.created_at).toLocaleTimeString('it-IT', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-[#ab7951]">{comment.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <div className="p-6 border-t border-[#cba281]/20">
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Il tuo nome"
                  value={newComment.username}
                  onChange={(e) => setNewComment(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#ead1b9] focus:border-[#cba281] focus:ring-2 focus:ring-[#cba281] focus:ring-opacity-20 transition-all duration-200 text-sm"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Scrivi un commento..."
                    value={newComment.comment}
                    onChange={(e) => setNewComment(prev => ({ ...prev, comment: e.target.value }))}
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-[#ead1b9] focus:border-[#cba281] focus:ring-2 focus:ring-[#cba281] focus:ring-opacity-20 transition-all duration-200 text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting || !newComment.username.trim() || !newComment.comment.trim()}
                    className="bg-gradient-to-r from-[#cba281] to-[#ab7951] text-white p-2 rounded-xl hover:from-[#ab7951] hover:to-[#cba281] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;