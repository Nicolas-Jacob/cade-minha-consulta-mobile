import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  color: ColorValue;
  size: number;
  focused: boolean;
}

/**
 * Cria o `tabBarIcon` de uma aba: ícone vazado quando inativa e preenchido quando ativa.
 * Usado pelas abas do cidadão e do gestor.
 */
export function tabIcon(name: IconName, focusedName: IconName) {
  function TabIcon({ color, size, focused }: TabIconProps) {
    return <Ionicons name={focused ? focusedName : name} size={size} color={color as string} />;
  }
  return TabIcon;
}
