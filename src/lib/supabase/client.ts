import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSupabaseServerClient() {
  const { createServerClient } = await import('@supabase/ssr');
  const cookies = await import('next/headers').then(mod => mod.cookies);
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookies().get(name)?.value;
        },
        set(name, value, options) {
          cookies().set(name, value, options);
        },
        remove(name, options) {
          cookies().set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
}

export async function getUser() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    return data;
  }
  
  return null;
}