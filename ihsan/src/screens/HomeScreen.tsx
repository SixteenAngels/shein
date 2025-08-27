import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';
import ProductCard, { Product } from '../components/ProductCard';
import ProductPreviewModal from './ProductPreviewModal';
import ChatBubble from '../components/ChatBubble';
import { useCartStore } from '../store/cart';
import { fetchProducts } from '../services/products';

export default function HomeScreen() {
  const [preview, setPreview] = useState<Product | null>(null);
  const add = useCartStore((s) => s.add);
  const numColumns = 2;
  const cardWidth = Dimensions.get('window').width / numColumns - 18;

  const [data, setData] = useState<Product[]>([]);
  useEffect(() => {
    (async () => {
      const rows = await fetchProducts({});
      const mapped: Product[] = rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        imageUrl: r.image_url,
        price: r.price,
        isReadyNow: !!r.ready_now,
        isGroupBuy: !!r.group_buy_enabled,
      }));
      setData(mapped);
    })();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-semibold">Ihsan</Text>
        <Text className="text-muted mt-1">Discover deals and Ready Now</Text>
      </View>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
        data={data}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth, margin: 6 }}>
            <ProductCard product={item} onPress={setPreview} onAddToCart={(p) => add(p, 1)} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {preview && (
        <ProductPreviewModal
          product={preview}
          onClose={() => setPreview(null)}
          onAddToCart={(p) => { add(p, 1); setPreview(null); }}
        />
      )}

      <ChatBubble onPress={() => { /* open chat in future */ }} />
    </View>
  );
}

