import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthProvider';

export default function OtpScreen() {
  const route = useRoute<any>();
  const email: string = route.params?.email ?? '';
  const { verifyEmailOtp } = useAuth();
  const [token, setToken] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <View className="flex-1 p-6 gap-4 bg-white">
      <Text className="text-2xl font-semibold">Enter OTP</Text>
      <Text className="text-muted">We sent a code to {email}</Text>
      <TextInput
        value={token}
        onChangeText={setToken}
        placeholder="6-digit code"
        className="border border-gray-300 rounded-xl px-4 py-3"
        keyboardType="number-pad"
      />
      {message && <Text className="text-[#ff3366]">{message}</Text>}
      <Pressable
        className="bg-[#ff3366] rounded-xl py-4 items-center"
        onPress={async () => {
          const { error } = await verifyEmailOtp(email, token);
          if (error) setMessage(error.message);
        }}
      >
        <Text className="text-white font-semibold">Verify</Text>
      </Pressable>
    </View>
  );
}

