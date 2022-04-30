import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MemoListScreen from './MemoListScreen';
import MemoDetailScreen from './MemoDetailScreen';
import MemoEditScreen from './MemoEditScreen';
import MemoCreateScreen from './MemoCreateScreen';

const Stack = createStackNavigator();

export default function MemoScreen() {
  return (
    <Stack.Navigator
      initialRouteName="MemoList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MemoList" component={MemoListScreen} />
      <Stack.Screen name="MemoDetail" component={MemoDetailScreen} />
      <Stack.Screen name="MemoEdit" component={MemoEditScreen} />
      <Stack.Screen name="MemoCreate" component={MemoCreateScreen} />
    </Stack.Navigator>
  );
}
