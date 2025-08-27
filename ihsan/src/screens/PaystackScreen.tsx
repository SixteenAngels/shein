import React from 'react';
import { View } from 'react-native';
import PaystackWebView from 'react-native-paystack-webview';
import { Platform } from 'react-native';

type Props = {
  route: any;
  navigation: any;
};

export default function PaystackScreen({ route, navigation }: Props) {
  const { email, amountKobo, reference } = route.params;
  const publicKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY as string;

  return (
    <View style={{ flex: 1 }}>
      <PaystackWebView
        paystackKey={publicKey}
        amount={amountKobo / 100}
        billingEmail={email}
        billingName={Platform.OS === 'ios' ? 'Ihsan User' : undefined}
        channels={['card', 'mobile_money']}
        currency="GHS"
        activityIndicatorColor="#ff3366"
        onCancel={() => navigation.goBack()}
        onSuccess={({ data }) => {
          navigation.navigate('Checkout', { paymentSuccess: true, reference, paystack: data });
        }}
        autoStart
      />
    </View>
  );
}

