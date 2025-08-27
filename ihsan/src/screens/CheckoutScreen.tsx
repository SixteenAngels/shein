import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useCartStore } from '../store/cart';

export default function CheckoutScreen() {
  const { items, clear } = useCartStore();
  const [shipping, setShipping] = useState<'air-normal' | 'air-also' | 'sea'>('air-normal');

  const total = useMemo(() => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0), [items]);

  return (
    <View className="flex-1 p-4 gap-4">
      <Text className="text-xl font-semibold">Checkout</Text>

      <View className="bg-white rounded-xl p-3">
        <Text className="font-semibold mb-2">Shipping Method</Text>
        <View className="flex-row gap-2">
          {(['air-normal','air-also','sea'] as const).map((method) => (
            <Pressable key={method} onPress={() => setShipping(method)}
              className={`px-3 py-2 rounded-full ${shipping===method? 'bg-[#ff3366]':'bg-gray-100'}`}>
              <Text className={`${shipping===method? 'text-white':'text-black'}`}>
                {method === 'air-normal' ? 'Air: Normal' : method === 'air-also' ? 'Air: Also' : 'Sea Shipping'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="bg-white rounded-xl p-3">
        <Text className="font-semibold mb-2">Summary</Text>
        <Text>Items: {items.length}</Text>
        <Text className="text-lg font-bold mt-1">Total: ₵{total}</Text>
      </View>

      <Pressable className="bg-[#ff3366] rounded-xl py-4 items-center" onPress={clear}>
        <Text className="text-white font-semibold">Place Order</Text>
      </Pressable>
    </View>
  );
}

