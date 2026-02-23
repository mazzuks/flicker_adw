import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { UserRoleGlobal } from '../types/database';

interface UserProfile {
  id: string;
  account_id: string | null;
  full_name: string | null;
  email: string;
  role_global: UserRoleGlobal;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  isAdworks: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await loadUserProfile(currentSession.user.id);
      }

      setLoading(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        (async () => {
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (newSession?.user) {
            await loadUserProfile(newSession.user.id);
          } else {
            setProfile(null);
          }
        })();
      });

      return () => subscription.unsubscribe();
    })();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data && !error) {
      setProfile(data as UserProfile);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (data.user && !error) {
       // Create account and profile manually for the new tenant
       const { data: account } = await supabase.from('accounts').insert({
         name: `Empresa de ${fullName}`,
         plan: 'trial'
       }).select().single();

       if (account) {
         await supabase.from('user_profiles').insert({
           id: data.user.id,
           email,
           full_name: fullName,
           account_id: account.id,
           role_global: 'CLIENT_OWNER'
         });
       }
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const isAdworks =
    profile?.role_global?.startsWith('ADWORKS_') ||
    profile?.role_global?.startsWith('OPERATOR_') ||
    false;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isAdworks,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
