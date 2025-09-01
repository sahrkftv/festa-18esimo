/*
  # Create guestbook table for birthday messages

  1. New Tables
    - `guestbook_entries`
      - `id` (uuid, primary key)
      - `username` (text, guest name)
      - `message` (text, birthday message)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `guestbook_entries` table
    - Add policy for public read access
    - Add policy for public insert access
*/

CREATE TABLE IF NOT EXISTS guestbook_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
  ON guestbook_entries 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access" 
  ON guestbook_entries 
  FOR INSERT 
  WITH CHECK (true);