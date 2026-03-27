
-- Encouragement messages table
CREATE TABLE public.encouragement_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.encouragement_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view encouragement messages"
ON public.encouragement_messages FOR SELECT TO authenticated
USING (active = true);

-- Seed encouragement messages
INSERT INTO public.encouragement_messages (message) VALUES
('Never give up 💪'),
('You are stronger than you think 🌟'),
('Tomorrow needs you ☀️'),
('Keep going 🏃'),
('Your story is not over 📖'),
('You matter 💛'),
('One step at a time 👣'),
('It''s okay to not be okay 🤗'),
('You are not alone 🤝'),
('This feeling will pass 🌈'),
('Be kind to yourself today 💐'),
('Someone out there cares about you 💕'),
('Your feelings are valid. Always. 🌻'),
('Brighter days are ahead ☀️'),
('You''re doing great just by being here 🌸');

-- Profiles table for anonymous identity
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_name TEXT NOT NULL,
  avatar_seed TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  bio TEXT DEFAULT '',
  mood_status TEXT DEFAULT NULL,
  support_score INTEGER NOT NULL DEFAULT 0,
  hugs_received INTEGER NOT NULL DEFAULT 0,
  hugs_sent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all anonymous profiles"
ON public.profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- Function to generate random anonymous name
CREATE OR REPLACE FUNCTION public.generate_anonymous_name()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  adjectives TEXT[] := ARRAY['Silent', 'Brave', 'Calm', 'Hidden', 'Night', 'Hope', 'Quiet', 'Rising', 'Gentle', 'Kind', 'Warm', 'Bright', 'Free', 'Wild', 'Soft'];
  nouns TEXT[] := ARRAY['Moon', 'Heart', 'River', 'Star', 'Thinker', 'Walker', 'Soul', 'Sun', 'Light', 'Dream', 'Wave', 'Cloud', 'Bird', 'Flame', 'Breeze'];
  rand_num INTEGER;
BEGIN
  rand_num := floor(random() * 99 + 1)::INTEGER;
  RETURN adjectives[floor(random() * array_length(adjectives, 1) + 1)::INTEGER] 
    || nouns[floor(random() * array_length(nouns, 1) + 1)::INTEGER] 
    || rand_num::TEXT;
END;
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, anonymous_name)
  VALUES (NEW.id, generate_anonymous_name());
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add post_type column to entries
ALTER TABLE public.entries ADD COLUMN post_type TEXT NOT NULL DEFAULT 'feeling';
-- post_type values: 'feeling', 'confession', 'need_advice', 'want_to_talk', 'vent'

-- Mood entries for mood tracking
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood entries"
ON public.mood_entries FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries"
ON public.mood_entries FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries"
ON public.mood_entries FOR DELETE TO authenticated
USING (auth.uid() = user_id);
