import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOtp, verifyOtp } from '../services/otp';

type Props = { navigation: any };

export default function PhoneOtpScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <View className="flex-1 p-6 gap-3 bg-white">
      <Text className="text-2xl font-semibold">Verify your phone</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone number"
        className="border rounded-xl px-4 py-3"
        keyboardType="phone-pad"
      />
      {sent && (
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="6-digit code"
          className="border rounded-xl px-4 py-3"
          keyboardType="number-pad"
        />
      )}
      {msg && <Text className="text-[#ff3366]">{msg}</Text>}
      {!sent ? (
        <Pressable className="bg-[#ff3366] rounded-xl py-4 items-center" onPress={async () => {
          try { await sendOtp(phone); setSent(true); setMsg('Code sent.'); } catch (e: any) { setMsg(e?.message || 'Failed'); }
        }}>
          <Text className="text-white font-semibold">Send Code</Text>
        </Pressable>
      ) : (
        <Pressable className="bg-[#ff3366] rounded-xl py-4 items-center" onPress={async () => {
          try { await verifyOtp(phone, code); await AsyncStorage.setItem('otpVerified','1'); navigation.replace('Root'); } catch (e: any) { setMsg(e?.message || 'Invalid'); }
        }}>
          <Text className="text-white font-semibold">Verify</Text>
        </Pressable>
      )}
    </View>
  );
}

