import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LogInScreen from './LogInScreen';
import ConfirmScreen from './ConfirmScreen';

const Stack = createStackNavigator();

export default function MemoScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="Confirm" component={ConfirmScreen} />
    </Stack.Navigator>
  );
}
