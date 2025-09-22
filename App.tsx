// App.tsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// 1. Import SafeAreaProvider
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    // 2. Bọc toàn bộ ứng dụng bằng SafeAreaProvider
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigator />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;