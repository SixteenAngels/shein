import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import type { Product } from '../components/ProductCard';
import { useCartStore } from '../store/cart';

type Props = { product: Product; onClose: () => void };

export default function BuyNowModal({ product, onClose }: Props) {
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);
  return (
    <View className="absolute inset-0 bg-black/40 items-center justify-center p-3">
      <View className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl flex-row">
        <View className="flex-1">
          <Image source={{ uri: product.imageUrl }} className="w-full aspect-[3/2] bg-gray-100" />
          <View className="p-4">
            <Text className="text-lg font-semibold" numberOfLines={2}>{product.name}</Text>
            <Text className="text-xl font-bold mt-2">₵{product.price}</Text>
          </View>
        </View>
        <View className="flex-1 p-4 gap-4">
          <Text className="text-lg font-semibold">Buy Now</Text>
          <View className="flex-row items-center gap-3">
            <Pressable className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center" onPress={() => setQty(Math.max(1, qty-1))}><Text>-</Text></Pressable>
            <Text className="text-lg font-semibold">{qty}</Text>
            <Pressable className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center" onPress={() => setQty(qty+1)}><Text>+</Text></Pressable>
          </View>
          <Pressable className="bg-[#ff3366] rounded-xl py-4 items-center" onPress={() => { add(product, qty); onClose(); }}>
            <Text className="text-white font-semibold">Confirm</Text>
          </Pressable>
          <Pressable className="bg-gray-100 rounded-xl py-4 items-center" onPress={onClose}>
            <Text className="font-semibold">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

