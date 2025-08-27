import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import type { Product } from '../components/ProductCard';

type Props = { product: Product; onClose: () => void; onAddToCart: (p: Product) => void };

export default function ProductPreviewModal({ product, onClose, onAddToCart }: Props) {
  return (
    <View className="absolute inset-0 bg-black/40 items-center justify-center p-4">
      <View className="bg-white rounded-2xl overflow-hidden w-full max-w-xl">
        <Image source={{ uri: product.imageUrl }} className="w-full aspect-[3/2] bg-gray-100" />
        <View className="p-4">
          <Text className="text-lg font-semibold" numberOfLines={2}>{product.name}</Text>
          <Text className="text-xl font-bold mt-2">₵{product.price}</Text>
          <View className="flex-row gap-2 mt-4">
            <Pressable onPress={() => onAddToCart(product)} className="flex-1 bg-[#ff3366] rounded-xl py-3 items-center">
              <Text className="text-white font-semibold">Add to Cart</Text>
            </Pressable>
            <Pressable onPress={onClose} className="flex-1 bg-gray-100 rounded-xl py-3 items-center">
              <Text className="font-semibold">Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

