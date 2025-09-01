export interface Photo {
  id: string;
  url: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
  likes_count: number;
}

export interface Comment {
  id: string;
  photo_id: string;
  username: string;
  comment: string;
  created_at: string;
}

export interface GuestbookEntry {
  id: string;
  username: string;
  message: string;
  created_at: string;
}