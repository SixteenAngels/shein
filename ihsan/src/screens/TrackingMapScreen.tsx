import React from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { View } from 'react-native';

type Props = {
  route?: any;
};

export default function TrackingMapScreen({ route }: Props) {
  const { coords = { latitude: 5.614818, longitude: -0.205874 }, path = [] } = route?.params ?? {};
  const region = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View className="flex-1">
      <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE} initialRegion={region}>
        <Marker coordinate={coords} />
        {path.length > 1 && (
          <Polyline coordinates={path} strokeColor="#ff3366" strokeWidth={3} />
        )}
      </MapView>
    </View>
  );
}

