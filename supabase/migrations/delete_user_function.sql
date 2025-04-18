
-- Create a function to delete a user account
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid := auth.uid();
  result json;
BEGIN
  -- Delete days entries
  DELETE FROM public.days WHERE user_id = user_id;
  
  -- Delete cycles
  DELETE FROM public.cycles WHERE user_id = user_id;
  
  -- Delete profile
  DELETE FROM public.profiles WHERE id = user_id;
  
  -- Return success
  result := json_build_object('success', true);
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    result := json_build_object('success', false, 'error', SQLERRM);
    RETURN result;
END;
$$;
