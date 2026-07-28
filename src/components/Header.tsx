import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import { fontSize, fontWeight, spacing } from '@/src/theme/spacing';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
  subtitle?: string;
}

export function Header({ title, showBack, right, subtitle }: HeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>
        ) : null}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backBtn: { marginRight: 8 },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textLight, marginTop: 2 },
});
