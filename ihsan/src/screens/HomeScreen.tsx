import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';
import ProductCard, { Product } from '../components/ProductCard';
import ProductPreviewModal from './ProductPreviewModal';
import ChatBubble from '../components/ChatBubble';
import GroupBuyBanner from '../components/GroupBuyBanner';
import { fetchOpenGroupBuys } from '../services/groupBuy';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../store/cart';
import { fetchProducts } from '../services/products';

export default function HomeScreen() {
  const [preview, setPreview] = useState<Product | null>(null);
  const add = useCartStore((s) => s.add);
  const numColumns = 2;
  const cardWidth = Dimensions.get('window').width / numColumns - 18;
  const navigation = useNavigation<any>();
  const [banners, setBanners] = useState<any[]>([]);

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
      try {
        const gbs = await fetchOpenGroupBuys(5);
        setBanners(gbs);
      } catch {}
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
        ListHeaderComponent={
          banners.length ? (
            <View style={{ paddingHorizontal: 4, paddingBottom: 8 }}>
              {banners.map((b) => (
                <GroupBuyBanner
                  key={b.id}
                  title={"Group Buy: " + b.product_id}
                  subtitle={"Ends: " + new Date(b.expires_at).toLocaleString()}
                  onPress={() => navigation.navigate('GroupBuyDetail', { id: b.id })}
                />)
              )}
            </View>
          ) : null
        }
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

