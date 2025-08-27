import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useAuth } from '../../context/AuthProvider';

export default function RegisterScreen() {
  const { signUpWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <View className="flex-1 p-6 gap-4 bg-white">
      <Text className="text-2xl font-semibold">Create Account</Text>
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
          const { error } = await signUpWithPassword(email, password);
          if (error) setMessage(error.message); else setMessage('Check your email to verify.');
        }}
      >
        <Text className="text-white font-semibold">Register</Text>
      </Pressable>
    </View>
  );
}

