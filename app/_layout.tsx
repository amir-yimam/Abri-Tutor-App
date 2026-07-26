import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, LanguageProvider, useAuth } from '@/src/context/AuthContext';
import { ToastProvider } from '@/src/context/ToastContext';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/src/theme/colors';

function RootNav() {
  useFrameworkReady();
  const { user, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;
    const inPublicGroup = segments[0] === '(public)';
    const inAuthGroup = segments[0] === '(auth)';
    const inTutorGroup = segments[0] === '(tutor)';
    const inParentGroup = segments[0] === '(parent)';

    if (!user && (inTutorGroup || inParentGroup)) {
      router.replace('/(public)/index');
    } else if (user && (inPublicGroup || inAuthGroup)) {
      if (user.role === 'tutor') router.replace('/(tutor)/home');
      else router.replace('/(parent)/home');
    }
  }, [user, initializing, segments, router]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(public)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tutor)" />
        <Stack.Screen name="(parent)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <RootNav />
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
