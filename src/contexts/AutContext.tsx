'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { supabase } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'customer' | 'shopper', name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

type SupabaseError = {
  message: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active session and set the user
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (userData) {
            setUser(userData as User);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: boolean) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (userData) {
            setUser(userData as User);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      setUser(userData as User);
      
      // Redirect based on role
      switch (userData.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'shopper':
          router.push('/dashboard');
          break;
        case 'customer':
          router.push('/markets');
          break;
        default:
          router.push('/');
      }
    } catch (error: unknown) {
      console.error('Error signing in:', error);
      const supabaseError = error as SupabaseError;
      throw supabaseError;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: 'customer' | 'shopper', name: string) => {
    setIsLoading(true);
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Create user profile
      const newUser = {
        id: data.user!.id,
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (role === 'shopper') {
        const shopperData = {
          ...newUser,
          rating: 0,
          availableForOrders: true,
          completedOrders: 0,
          servingMarkets: [],
        };
        
        await supabase.from('users').insert([shopperData]);
      } else {
        await supabase.from('users').insert([newUser]);
      }
      
      // Redirect to respective page
      router.push(role === 'shopper' ? '/auth/shopper/complete-profile' : '/markets');
    } catch (error: unknown) {
      console.error('Error signing up:', error);
      const supabaseError = error as SupabaseError;
      throw supabaseError;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error: unknown) {
      console.error('Error signing out:', error);
      const supabaseError = error as SupabaseError;
      throw supabaseError;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...data,
          updatedAt: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      const supabaseError = error as SupabaseError;
      throw supabaseError;
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};