import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { BaseUser, Role } from '@/src/types';
import { supabase } from '@/src/services/supabase';
import { AppLanguage } from '@/src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextValue {
  user: BaseUser | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<BaseUser>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: Role
  ) => Promise<BaseUser>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (patch: Partial<BaseUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BaseUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  const fetchProfile = useCallback(async (uid: string): Promise<BaseUser | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();
    if (error || !data) return null;
    return {
      uid: data.id,
      role: data.role,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      profilePhoto: data.profile_photo,
      createdAt: data.created_at,
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && mounted) {
        const profile = await fetchProfile(session.user.id);
        if (profile && mounted) setUser(profile);
      }
      if (mounted) setInitializing(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (mounted && profile) setUser(profile);
        } else {
          if (mounted) setUser(null);
        }
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const profile = await fetchProfile(data.user.id);
    if (!profile) throw new Error('Profile not found');
    setUser(profile);
    return profile;
  }, [fetchProfile]);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string, phone: string, role: Role) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { fullName, phone, role } },
      });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('Sign up failed');

      // Update profile with role, full name, phone
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role, full_name: fullName, phone })
        .eq('id', data.user.id);
      if (updateError) throw new Error(updateError.message);

      const profile = await fetchProfile(data.user.id);
      if (!profile) throw new Error('Profile not found');
      setUser(profile);
      return profile;
    },
    [fetchProfile]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const profile = await fetchProfile(user.uid);
    if (profile) setUser(profile);
  }, [user, fetchProfile]);

  const updateUser = useCallback(
    async (patch: Partial<BaseUser>) => {
      if (!user) return;
      const updateData: Record<string, unknown> = {};
      if (patch.fullName !== undefined) updateData.full_name = patch.fullName;
      if (patch.phone !== undefined) updateData.phone = patch.phone;
      if (patch.profilePhoto !== undefined) updateData.profile_photo = patch.profilePhoto;

      const { error } = await supabase.from('profiles').update(updateData).eq('id', user.uid);
      if (error) throw new Error(error.message);
      setUser({ ...user, ...patch });
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, initializing, login, signUp, logout, resetPassword, refreshUser, updateUser }),
    [user, initializing, login, signUp, logout, resetPassword, refreshUser, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ---------- Language context ----------
interface LangContextValue {
  lang: AppLanguage;
  setLang: (l: AppLanguage) => void;
}

const LangContext = createContext<LangContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AppLanguage>('am');
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('at_lang');
      if (stored === 'en' || stored === 'am') setLangState(stored);
      else setLangState('am');
    })();
  }, []);
  const setLang = useCallback((l: AppLanguage) => {
    setLangState(l);
    AsyncStorage.setItem('at_lang', l);
  }, []);
  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
