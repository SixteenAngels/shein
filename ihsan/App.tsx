import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation';
import { AuthProvider } from './src/context/AuthProvider';
import "./global.css";

const queryClient = new QueryClient();

const AppTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    card: '#ffffff',
    text: '#111315',
    border: '#e5e7eb',
    primary: '#ff3366',
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer theme={AppTheme}>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </NavigationContainer>
          <StatusBar style="dark" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
