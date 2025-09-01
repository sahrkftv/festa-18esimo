/*
  # Create comments table for photo comments

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `photo_id` (uuid, foreign key to photos)
      - `username` (text, commenter name)
      - `content` (text, comment content)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `comments` table
    - Add policy for public read access
    - Add policy for public insert access
*/

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  username text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
  ON comments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access" 
  ON comments 
  FOR INSERT 
  WITH CHECK (true);