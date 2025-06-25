-- Create the generations table
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    deleted BOOLEAN DEFAULT false NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own generations
CREATE POLICY "Users can view their own generations"
    ON public.generations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own generations
CREATE POLICY "Users can insert their own generations"
    ON public.generations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own generations
CREATE POLICY "Users can update their own generations"
    ON public.generations
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own generations
CREATE POLICY "Users can delete their own generations"
    ON public.generations
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS generations_user_id_idx ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS generations_created_at_idx ON public.generations(created_at);

-- Create function to delete old generations (30-day retention)
CREATE OR REPLACE FUNCTION delete_old_generations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.generations
    SET deleted = true
    WHERE created_at < NOW() - INTERVAL '30 days'
    AND deleted = false;
END;
$$;

-- Create cron job to run delete_old_generations daily
SELECT cron.schedule(
    'delete-old-generations',
    '0 0 * * *', -- Run at midnight every day
    $$SELECT delete_old_generations();$$
); 