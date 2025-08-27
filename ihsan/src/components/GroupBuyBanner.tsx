import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

export default function GroupBuyBanner({ title, subtitle, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="bg-[#ff3366] rounded-xl p-4 my-3">
      <Text className="text-white text-lg font-semibold">{title}</Text>
      {!!subtitle && <Text className="text-white/90 mt-1">{subtitle}</Text>}
    </Pressable>
  );
}

