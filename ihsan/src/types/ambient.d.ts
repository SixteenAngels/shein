declare module 'react-native-paystack-webview' {
  import * as React from 'react';
  interface PaystackWebViewProps {
    paystackKey: string;
    amount: number;
    billingEmail: string;
    activityIndicatorColor?: string;
    onCancel?: () => void;
    onSuccess?: (e: { data: unknown }) => void;
    autoStart?: boolean;
  }
  const PaystackWebView: React.ComponentType<PaystackWebViewProps>;
  export default PaystackWebView;
}

