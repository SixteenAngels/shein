import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { fetchGroupBuy, fetchParticipants, getTierPrice, joinGroupBuy } from '../services/groupBuy';

type Props = { route: any };

export default function GroupBuyDetailScreen({ route }: Props) {
  const id = route.params?.id as string;
  const [gb, setGb] = useState<any>();
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const g = await fetchGroupBuy(id);
      setGb(g);
      const p = await fetchParticipants(id);
      setParticipants(p);
    })();
  }, [id]);

  const totalQty = useMemo(() => participants.reduce((s, p) => s + p.quantity, 0), [participants]);
  const currentPrice = gb ? getTierPrice(gb.tiers, Math.max(totalQty, gb.min_qty)) : undefined;

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-semibold mb-2">Group Buy</Text>
      {gb && (
        <>
          <Text>Min: {gb.min_qty}  Max: {gb.max_qty}</Text>
          <Text>Quantity so far: {totalQty}</Text>
          <Text className="mt-2">Current price (per item): {currentPrice ?? '-'} </Text>
          <Pressable
            className="bg-[#ff3366] rounded-xl py-3 mt-4 items-center"
            onPress={async () => {
              if (!gb) return;
              const unit = getTierPrice(gb.tiers, Math.max(totalQty + 1, gb.min_qty)) || 0;
              await joinGroupBuy({ group_buy_id: gb.id, quantity: 1, unit_price: unit });
              const p = await fetchParticipants(id);
              setParticipants(p);
            }}
          >
            <Text className="text-white font-semibold">Join with 1 item</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

