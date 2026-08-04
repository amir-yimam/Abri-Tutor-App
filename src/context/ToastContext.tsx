import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';
import { CheckCircle, XCircle, Info } from 'lucide-react-native';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Modal transparent visible={toasts.length > 0} animationType="fade" statusBarTranslucent>
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 60 }}>
          {toasts.map((t) => {
            const Icon = t.type === 'success' ? CheckCircle : t.type === 'error' ? XCircle : Info;
            const bg = t.type === 'success' ? colors.success : t.type === 'error' ? colors.error : colors.info;
            return (
              <View
                key={t.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: bg,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  marginVertical: 4,
                  maxWidth: '90%',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 5,
                }}
              >
                <Icon size={20} color={colors.white} />
                <Text style={{ color: colors.white, marginLeft: 8, fontSize: 14, fontWeight: '500', flexShrink: 1 }}>
                  {t.message}
                </Text>
              </View>
            );
          })}
        </View>
      </Modal>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
