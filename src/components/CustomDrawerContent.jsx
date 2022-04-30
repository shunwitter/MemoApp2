import React, { useContext, useCallback } from 'react';
import {
  Alert, Text, View, StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import firebase from 'firebase';

import UserContext from '../utils/UserContext';
import Button from './Button';

export default function CustomDrawerContent(props) {
  const { navigation } = props;
  const user = useContext(UserContext);

  const handleLogOut = useCallback(() => {
    Alert.alert('ログアウトします', 'よろしいですか？', [
      {
        text: 'キャンセル',
        onPress: () => {},
      },
      {
        text: 'OK',
        onPress: () => {
          firebase.auth().signOut()
            .then(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Memo' }],
              });
            })
            .catch((error) => {
              console.log(error);
              Alert.alert('ログアウトに失敗しました');
            });
        },
      },
    ]);
  });

  const handleDeleteAccount = useCallback(() => {
    navigation.navigate('DeleteAccount');
  });

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <DrawerContentScrollView {...props}>
      {user?.isAnonymous ? (
        <View>
          <View style={styles.header}>
            <Text>アカウント登録すると複数のデバイスからメモにアクセスできます。</Text>
            <Button style={styles.button} label="登録する" onPress={() => navigation.navigate('SignUp')} />
          </View>
          <DrawerItem labelStyle={styles.item} label="ログイン" onPress={() => navigation.navigate('LogIn')} />
          <DrawerItem labelStyle={styles.item} label="メモの一覧" onPress={() => navigation.navigate('Memo')} />
        </View>
      ) : (
        <View>
          {user && (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Email</Text>
              <Text>{user.email}</Text>
            </View>
          )}
          <View>
            <DrawerItem labelStyle={styles.item} label="メモの一覧" onPress={() => navigation.navigate('Memo')} />
            <DrawerItem labelStyle={styles.item} label="ログアウト" onPress={handleLogOut} />
            <DrawerItem labelStyle={styles.item} label="アカウントの削除" onPress={handleDeleteAccount} />
          </View>
        </View>
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    fontSize: 16,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
  header: {
    padding: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
});
