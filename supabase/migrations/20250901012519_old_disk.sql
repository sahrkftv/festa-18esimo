/*
  # Create photos table for DJ SCMP 18th birthday gallery

  1. New Tables
    - `photos`
      - `id` (uuid, primary key)
      - `url` (text, photo URL)
      - `uploaded_by` (text, username of uploader)
      - `created_at` (timestamp)
      - `likes_count` (integer, default 0)

  2. Security
    - Enable RLS on `photos` table
    - Add policy for public read access
    - Add policy for public insert access
    - Add policy for public update access (for likes)
*/

CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  uploaded_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  likes_count integer DEFAULT 0
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
  ON photos 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access" 
  ON photos 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update of likes" 
  ON photos 
  FOR UPDATE 
  USING (true) 
  WITH CHECK (true);