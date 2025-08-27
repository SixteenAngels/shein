import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OrdersScreen() {
  const navigation = useNavigation<any>();
  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-semibold mb-4">My Orders</Text>
      <Pressable
        onPress={() => navigation.navigate('TrackingMap', {
          coords: { latitude: 5.614818, longitude: -0.205874 },
          path: [
            { latitude: 5.614818, longitude: -0.205874 },
            { latitude: 5.624, longitude: -0.205 },
          ],
        })}
        className="bg-gray-100 rounded-xl p-4"
      >
        <Text>Order #IH1234</Text>
        <Text className="text-muted mt-1">Status: In Transit</Text>
        <Text className="text-[#ff3366] mt-2">Track Order →</Text>
      </Pressable>
    </View>
  );
}

