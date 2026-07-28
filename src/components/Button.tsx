import { ActivityIndicator, Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '@/src/theme/colors';
import { radius, shadows, fontSize, fontWeight, spacing } from '@/src/theme/spacing';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: object;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon,
  style,
  fullWidth,
}: ButtonProps) {
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
      ? colors.secondary
      : variant === 'danger'
      ? colors.error
      : variant === 'outline'
      ? colors.white
      : 'transparent';
  const textColor =
    variant === 'outline' ? colors.primary : variant === 'ghost' ? colors.primary : colors.white;
  const borderColor = variant === 'outline' ? colors.border : 'transparent';

  const padding =
    size === 'sm'
      ? { paddingVertical: 8, paddingHorizontal: 14 }
      : size === 'lg'
      ? { paddingVertical: 16, paddingHorizontal: 24 }
      : { paddingVertical: 12, paddingHorizontal: 18 };
  const text = size === 'sm' ? fontSize.sm : size === 'lg' ? fontSize.lg : fontSize.md;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, borderColor, opacity: disabled ? 0.5 : pressed ? 0.88 : 1 },
        padding,
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
          <Text
            style={{
              color: textColor,
              fontSize: text,
              fontWeight: fontWeight.semibold,
              marginLeft: icon ? 8 : 0,
            }}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1.5,
  },
});
