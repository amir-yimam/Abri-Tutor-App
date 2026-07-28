import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import { fontSize, fontWeight, radius } from '@/src/theme/spacing';

type Tone = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  tone?: Tone;
  dot?: boolean;
}

export function Badge({ label, tone = 'neutral', dot }: BadgeProps) {
  const map: Record<Tone, { bg: string; fg: string; dotColor: string }> = {
    primary: { bg: colors.primaryLight, fg: colors.primary, dotColor: colors.primary },
    secondary: { bg: colors.secondaryLight, fg: colors.secondaryDark, dotColor: colors.secondary },
    success: { bg: colors.successLight, fg: colors.success, dotColor: colors.success },
    warning: { bg: colors.warningLight, fg: colors.secondaryDark, dotColor: colors.warning },
    error: { bg: colors.errorLight, fg: colors.error, dotColor: colors.error },
    info: { bg: colors.infoLight, fg: colors.info, dotColor: colors.info },
    neutral: { bg: colors.borderLight, fg: colors.textLight, dotColor: colors.textMuted },
  };
  const c = map[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      {dot ? <View style={[styles.dot, { backgroundColor: c.dotColor }]} /> : null}
      <Text style={[styles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  text: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
});
