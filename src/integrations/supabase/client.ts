// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zzscqctmumutavjtdbvb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6c2NxY3RtdW11dGF2anRkYnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTQ5MjQsImV4cCI6MjA2MDE5MDkyNH0.0eE6x0ykxc6DqWPPUScz6e0AIRME78EpmhB1z_POIIQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);