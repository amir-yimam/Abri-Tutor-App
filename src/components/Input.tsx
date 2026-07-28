import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { colors } from '@/src/theme/colors';
import { fontSize, fontWeight, radius, spacing } from '@/src/theme/spacing';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  error?: string;
  multiline?: boolean;
  style?: ViewStyle;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  error,
  multiline,
  style,
  autoCapitalize = 'none',
}: InputProps) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = !!secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrap,
          {
            borderColor: error ? colors.error : focused ? colors.primary : colors.border,
            backgroundColor: focused ? colors.white : colors.background,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !show}
          keyboardType={keyboardType}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
        />
        {isPassword ? (
          <Pressable onPress={() => setShow((s) => !s)} hitSlop={8}>
            {show ? <EyeOff size={20} color={colors.textLight} /> : <Eye size={20} color={colors.textLight} />}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.text, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  input: { flex: 1, fontSize: fontSize.md, color: colors.text, paddingVertical: 10 },
  error: { fontSize: fontSize.xs, color: colors.error, marginTop: 4, marginLeft: 4 },
});
