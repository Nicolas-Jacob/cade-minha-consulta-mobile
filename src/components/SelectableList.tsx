import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, MIN_TOUCH_SIZE, radius, spacing, typography } from '@/theme';

export interface SelectableItem {
  id: number;
  title: string;
  description?: string | null;
}

interface SelectableListProps {
  /** Nome do grupo, lido pelo leitor de tela. */
  label: string;
  items: SelectableItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

/**
 * Lista de escolha única (equivalente acessível a um picker), para listas
 * maiores que as do OptionGroup. Renderiza todos os itens: use dentro de um Screen com scroll.
 */
export function SelectableList({ label, items, selectedId, onSelect }: SelectableListProps) {
  return (
    <View style={styles.list} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {items.map((item) => {
        const selected = item.id === selectedId;
        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            accessibilityRole="radio"
            accessibilityLabel={
              item.description ? `${item.title}. ${item.description}` : item.title
            }
            accessibilityState={{ checked: selected }}
            style={({ pressed }) => [
              styles.item,
              selected && styles.itemSelected,
              pressed && styles.pressed,
            ]}>
            <Ionicons
              name={selected ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={selected ? colors.primary : colors.borderStrong}
            />
            <View style={styles.texts}>
              <Text style={[styles.title, selected && styles.titleSelected]}>{item.title}</Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: MIN_TOUCH_SIZE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  itemSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  pressed: {
    opacity: 0.8,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.body,
  },
  titleSelected: {
    fontFamily: typography.bodyBold.fontFamily,
    color: colors.primary,
  },
  description: {
    ...typography.caption,
  },
});
