import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export type Product = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  isReadyNow?: boolean;
  isGroupBuy?: boolean;
};

type Props = {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
};

export default function ProductCard({ product, onPress, onAddToCart }: Props) {
  return (
    <Pressable onPress={() => onPress?.(product)} className="w-full">
      <View className="rounded-xl overflow-hidden bg-white">
        <Image source={{ uri: product.imageUrl }} className="w-full aspect-[3/4] bg-gray-100" />
        <View className="p-2">
          <Text className="text-sm" numberOfLines={1}>{product.name}</Text>
          <Text className="text-base font-semibold mt-1">₵{product.price}</Text>
          <View className="flex-row gap-1 mt-2">
            {product.isReadyNow && (
              <View className="px-2 py-1 bg-green-100 rounded-full"><Text className="text-[10px] text-green-700">Ready Now</Text></View>
            )}
            {product.isGroupBuy && (
              <View className="px-2 py-1 bg-pink-100 rounded-full"><Text className="text-[10px] text-pink-700">Group Buy</Text></View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

