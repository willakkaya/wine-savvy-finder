-- Create scan history table
CREATE TABLE public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  wines_found INTEGER NOT NULL DEFAULT 0,
  top_value_wine_id UUID REFERENCES public.wine_database(id) ON DELETE SET NULL,
  highest_rated_wine_id UUID REFERENCES public.wine_database(id) ON DELETE SET NULL,
  scenario TEXT,
  image_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own scan history
CREATE POLICY "Users can view their own scan history"
ON public.scan_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own scan history
CREATE POLICY "Users can insert their own scan history"
ON public.scan_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own scan history
CREATE POLICY "Users can delete their own scan history"
ON public.scan_history
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_scan_history_user_id ON public.scan_history(user_id);
CREATE INDEX idx_scan_history_scan_date ON public.scan_history(scan_date DESC);