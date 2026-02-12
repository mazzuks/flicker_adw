import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { UserRoleGlobal } from '../types/database';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role_global: UserRoleGlobal;
  avatar_url: string | null;
}

interface ClientMembership {
  id: string;
  client_id: string;
  role_in_client: string;
  client: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  memberships: ClientMembership[];
  currentClientId: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  setCurrentClientId: (clientId: string | null) => void;
  isAdworks: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [memberships, setMemberships] = useState<ClientMembership[]>([]);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await loadUserProfile(currentSession.user.id);
        await loadMemberships(currentSession.user.id);
      }

      setLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        (async () => {
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (newSession?.user) {
            await loadUserProfile(newSession.user.id);
            await loadMemberships(newSession.user.id);
          } else {
            setProfile(null);
            setMemberships([]);
            setCurrentClientId(null);
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
      setProfile(data);
    }
  };

  const loadMemberships = async (userId: string) => {
    const { data, error } = await supabase
      .from('client_memberships')
      .select(`
        id,
        client_id,
        role_in_client,
        clients:client_id (
          id,
          name,
          slug,
          status
        )
      `)
      .eq('user_id', userId);

    if (data && !error) {
      const formattedMemberships = data.map((m: any) => ({
        id: m.id,
        client_id: m.client_id,
        role_in_client: m.role_in_client,
        client: Array.isArray(m.clients) ? m.clients[0] : m.clients,
      }));
      setMemberships(formattedMemberships);

      if (formattedMemberships.length > 0 && !currentClientId) {
        setCurrentClientId(formattedMemberships[0].client_id);
      }
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
    });

    if (data.user && !error) {
      // Pequeno delay para garantir que o trigger de auth termine (se houver)
      await new Promise(resolve => setTimeout(resolve, 500));

      const { error: profileError } = await supabase.from('user_profiles').insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role_global: 'CLIENT_OWNER',
      });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: `Empresa de ${fullName}`,
          slug: `${slug}-${Date.now()}`,
          plan: 'basic',
          status: 'ONBOARDING',
        })
        .select()
        .single();

      if (client && !clientError) {
        await supabase.from('client_memberships').insert({
          client_id: client.id,
          user_id: data.user.id,
          role_in_client: 'CLIENT_OWNER',
        });
      } else if (clientError) {
        console.error('Error creating client:', clientError);
      }
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setMemberships([]);
    setCurrentClientId(null);
  };

  const isAdworks = profile?.role_global?.startsWith('ADWORKS_') || profile?.role_global?.startsWith('OPERATOR_') || false;

  const impersonateClient = (clientId: string | null) => {
    setCurrentClientId(clientId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        memberships,
        currentClientId,
        loading,
        signIn,
        signUp,
        signOut,
        setCurrentClientId: impersonateClient,
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
