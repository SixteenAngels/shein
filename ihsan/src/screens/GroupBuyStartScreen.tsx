import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { startGroupBuy } from '../services/groupBuy';

type Props = { route: any; navigation: any };

export default function GroupBuyStartScreen({ route, navigation }: Props) {
  const { product_id } = route.params || {};
  const [minQty, setMinQty] = useState('5');
  const [maxQty, setMaxQty] = useState('10');
  const [hours, setHours] = useState('24');

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-semibold mb-4">Start a Group Buy</Text>
      <TextInput className="border rounded-xl px-3 py-2 mb-2" value={minQty} onChangeText={setMinQty} placeholder="Min quantity" keyboardType="number-pad" />
      <TextInput className="border rounded-xl px-3 py-2 mb-2" value={maxQty} onChangeText={setMaxQty} placeholder="Max quantity" keyboardType="number-pad" />
      <TextInput className="border rounded-xl px-3 py-2 mb-2" value={hours} onChangeText={setHours} placeholder="Duration hours" keyboardType="number-pad" />
      <Pressable
        className="bg-[#ff3366] rounded-xl py-3 items-center"
        onPress={async () => {
          const now = new Date();
          const expires = new Date(now.getTime() + Number(hours) * 3600 * 1000);
          const tiers = [
            { min: Number(minQty), max: Number(minQty) + 1, price: 10 },
            { min: Number(minQty) + 2, max: Number(maxQty) - 2, price: 9 },
            { min: Number(maxQty) - 1, max: Number(maxQty), price: 8 },
          ];
          const gb = await startGroupBuy({
            product_id,
            min_qty: Number(minQty),
            max_qty: Number(maxQty),
            tiers,
            expires_at: expires.toISOString(),
          });
          navigation.replace('GroupBuyDetail', { id: gb.id });
        }}
      >
        <Text className="text-white font-semibold">Create Group</Text>
      </Pressable>
    </View>
  );
}

