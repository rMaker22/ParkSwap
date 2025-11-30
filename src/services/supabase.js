import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credenciales de Supabase
const SUPABASE_URL = 'https://vjurhcbgzwckidniboto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdXJoY2Jnendja2lkbmlib3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MDQ0NjUsImV4cCI6MjA4MDA4MDQ2NX0.HV0JqwbDjl_2xLmUlr3NmDxig7-zbHOtlLltK9h9jx0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
