import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = { onPress?: () => void };

export default function ChatBubble({ onPress }: Props) {
  return (
    <View className="absolute right-4 bottom-6">
      <Pressable
        onPress={onPress}
        className="bg-[#ff3366] rounded-full w-14 h-14 items-center justify-center shadow-lg"
        android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
      >
        <Ionicons name="chatbubbles" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

