import { View, ViewStyle } from 'react-native';
import { colors } from '@/src/theme/colors';
import { radius, shadows } from '@/src/theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

export function Card({ children, style, padded = true }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          ...shadows.sm,
          ...(padded ? { padding: 18 } : {}),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
