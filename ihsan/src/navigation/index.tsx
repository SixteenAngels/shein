import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrackingMapScreen from '../screens/TrackingMapScreen';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AccountScreen from '../screens/AccountScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AuthNavigator from './AuthNavigator';
import BuyNowScreen from '../screens/BuyNowScreen';
import { useAuth } from '../context/AuthProvider';
import PaystackScreen from '../screens/PaystackScreen';
import GroupBuyDetailScreen from '../screens/GroupBuyDetailScreen';
import GroupBuyStartScreen from '../screens/GroupBuyStartScreen';
import PhoneOtpScreen from '../screens/PhoneOtpScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

export function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ff3366',
        tabBarIcon: ({ color, size }) => {
          const icon = route.name === 'Home' ? 'home' : route.name === 'Cart' ? 'cart' : route.name === 'Orders' ? 'cube' : 'person';
          return <Ionicons name={icon as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const [otpVerified, setOtpVerified] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    (async () => {
      const v = await import('@react-native-async-storage/async-storage').then(m => m.default.getItem('otpVerified'));
      setOtpVerified((await v) === '1');
    })();
  }, []);
  if (loading || otpVerified === null) return null;
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {otpVerified ? (
        <>
          <RootStack.Screen name="Root" component={Tabs} />
          <RootStack.Screen name="Checkout" component={CheckoutScreen} />
          <RootStack.Screen name="BuyNow" component={BuyNowScreen} />
          <RootStack.Screen name="Paystack" component={PaystackScreen} />
          <RootStack.Screen name="GroupBuyDetail" component={GroupBuyDetailScreen} />
          <RootStack.Screen name="GroupBuyStart" component={GroupBuyStartScreen} />
        </>
      ) : (
        <RootStack.Screen name="PhoneOtp" component={PhoneOtpScreen} />
      )}
      <RootStack.Screen name="TrackingMap" component={TrackingMapScreen} />
    </RootStack.Navigator>
  );
}

