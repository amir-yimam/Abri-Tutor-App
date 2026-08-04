export const colors = {
  // Primary - deep teal
  primary: '#0D7377',
  primaryDark: '#095456',
  primaryLight: '#D0F0F1',
  primarySoft: '#E8F8F9',

  // Secondary - warm amber
  secondary: '#F59E0B',
  secondaryDark: '#B45309',
  secondaryLight: '#FEF3C7',
  secondarySoft: '#FFFBEB',

  // Accent - coral
  accent: '#FF6B6B',
  accentLight: '#FFE5E5',

  // Neutrals
  background: '#F7F9FA',
  surface: '#FFFFFF',
  white: '#FFFFFF',
  text: '#1A2B33',
  textLight: '#5A6B73',
  textMuted: '#9AA8B0',
  border: '#E4E9ED',
  borderLight: '#F0F4F6',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Semantic
  card: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.45)',
  shadow: 'rgba(13, 115, 119, 0.10)',
  shadowDark: 'rgba(13, 115, 119, 0.18)',
};

export type ColorKey = keyof typeof colors;
