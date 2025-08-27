import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useAuth } from '../../context/AuthProvider';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const { signInWithPassword, signInWithGoogle, sendEmailOtp } = useAuth();
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <View className="flex-1 p-6 gap-4 bg-white">
      <Text className="text-2xl font-semibold">Welcome to Ihsan</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        className="border border-gray-300 rounded-xl px-4 py-3"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        className="border border-gray-300 rounded-xl px-4 py-3"
        secureTextEntry
      />
      {message && <Text className="text-[#ff3366]">{message}</Text>}
      <Pressable
        className="bg-[#ff3366] rounded-xl py-4 items-center"
        onPress={async () => {
          const { error } = await signInWithPassword(email, password);
          if (error) setMessage(error.message);
        }}
      >
        <Text className="text-white font-semibold">Sign In</Text>
      </Pressable>
      <Pressable
        className="bg-black rounded-xl py-4 items-center"
        onPress={async () => { await signInWithGoogle(); }}
      >
        <Text className="text-white font-semibold">Continue with Google</Text>
      </Pressable>
      <Pressable
        onPress={async () => {
          if (!email) { setMessage('Enter email first'); return; }
          const { error } = await sendEmailOtp(email);
          if (error) setMessage(error.message); else navigation.navigate('OTP', { email });
        }}
        className="py-2"
      >
        <Text className="text-[#ff3366] text-center">Sign in with OTP</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text className="text-center">New here? Create an account</Text>
      </Pressable>
    </View>
  );
}

