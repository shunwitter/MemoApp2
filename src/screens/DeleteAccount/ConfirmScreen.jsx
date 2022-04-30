import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, Alert,
} from 'react-native';
import firebase from 'firebase';

import Button from '../../components/Button';
import Loading from '../../components/Loading';
import UserContext from '../../utils/UserContext';

export default function ConfirmScreen(props) {
  const { navigation } = props;
  const user = useContext(UserContext);
  const [isLoading, setLoading] = useState(false);

  async function handlePress() {
    if (user == null) { return; }
    setLoading(true);
    try {
      const db = firebase.firestore();
      const batch = db.batch();
      const snapshot = await db.collection(`users/${user.uid}/memos`).get();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      await user.delete();
      setLoading(false);
      const drawerNavigation = navigation.getParent('LeftDrawer');
      Alert.alert('完了', 'アカウントを削除しました。', [
        {
          text: 'OK',
          onPress: () => {
            drawerNavigation?.reset({
              index: 0,
              routes: [{ name: 'Memo' }],
            });
          },
        },
      ]);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert('エラー', 'アカウントの削除に失敗しました。');
    }
  }

  return (
    <View style={styles.container}>
      <Loading isLoading={isLoading} />
      <View style={styles.inner}>
        <Text style={styles.title}>アカウントの削除</Text>
        <Text style={styles.description}>このアカウントとすべてのメモデータを削除します。この操作は取り消せません。</Text>
        <Button
          label="削除する"
          onPress={handlePress}
          style={{ backgroundColor: '#e35a5a' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  inner: {
    paddingHorizontal: 27,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  description: {
    marginBottom: 16,
    lineHeight: 20,
  },
});
