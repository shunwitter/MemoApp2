import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import firebase from 'firebase';

import MemoScreen from './src/screens/MemoScreen';
import LogInScreen from './src/screens/LogInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DeleteAccountScreen from './src/screens/DeleteAccount';
import CustomDrawerContent from './src/components/CustomDrawerContent';
import UserContext from './src/utils/UserContext';

import { firebaseConfig } from './env';

require('firebase/firestore');

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Drawer = createDrawerNavigator();
LogBox.ignoreLogs(['Setting a timer', 'AsyncStorage has been extracted']);

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const cleanup = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return cleanup;
  }, []);

  return (
    <UserContext.Provider value={currentUser}>
      <NavigationContainer>
        <Drawer.Navigator
          id="LeftDrawer"
          initialRouteName="Memo"
          drawerContent={CustomDrawerContent}
          screenOptions={{
            headerStyle: { backgroundColor: '#467FD3' },
            headerTitleStyle: { color: '#ffffff' },
            headerTitle: 'Memo App',
            headerTintColor: '#ffffff',
          }}
        >
          <Drawer.Screen name="Memo" component={MemoScreen} />
          <Drawer.Screen name="LogIn" component={LogInScreen} />
          <Drawer.Screen name="SignUp" component={SignUpScreen} />
          <Drawer.Screen name="DeleteAccount" component={DeleteAccountScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
