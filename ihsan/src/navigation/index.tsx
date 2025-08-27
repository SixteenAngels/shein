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
  if (loading) return null;
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <RootStack.Screen name="Root" component={Tabs} />
          <RootStack.Screen name="Checkout" component={CheckoutScreen} />
          <RootStack.Screen name="BuyNow" component={BuyNowScreen} />
          <RootStack.Screen name="Paystack" component={PaystackScreen} />
          <RootStack.Screen name="GroupBuyDetail" component={GroupBuyDetailScreen} />
          <RootStack.Screen name="GroupBuyStart" component={GroupBuyStartScreen} />
        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
      <RootStack.Screen name="TrackingMap" component={TrackingMapScreen} />
    </RootStack.Navigator>
  );
}

