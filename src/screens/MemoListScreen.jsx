import React, { useEffect, useState, useContext } from 'react';
import {
  View, StyleSheet, Alert, Text,
} from 'react-native';
import firebase from 'firebase';
import { useFocusEffect } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';

import MemoList from '../components/MemoList';
import CircleButton from '../components/CircleButton';
import Button from '../components/Button';
import Loading from '../components/Loading';
import UserContext from '../utils/UserContext';

export default function MemoListScreen(props) {
  const { navigation } = props;
  const [memos, setMemos] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const user = useContext(UserContext);

  // Replace header left button if current page is not MemoListScreen
  useFocusEffect(() => {
    const drawer = navigation.getParent('LeftDrawer');
    drawer?.setOptions({ headerLeft: null });
    return () => {
      drawer?.setOptions({
        headerLeft: () => (
          <HeaderBackButton
            label="Back"
            tintColor="#ffffff"
            onPress={() => { navigation.goBack(); }}
          />
        ),
      });
    };
  });

  useEffect(() => {
    setLoading(true);

    let cleanup = () => {};
    if (user) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${user.uid}/memos`).orderBy('updatedAt', 'desc');
      cleanup = ref.onSnapshot((snapshot) => {
        const userMemos = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          userMemos.push({
            id: doc.id,
            bodyText: data.bodyText,
            updatedAt: data.updatedAt.toDate(),
          });
        });
        setMemos(userMemos);
        setLoading(false);
      }, () => {
        setLoading(false);
      });
    } else {
      // 匿名ログイン（firebaseの Authentication > Sign-in method から有効にする必要があります）
      firebase.auth().signInAnonymously()
        .catch(() => {
          Alert.alert('エラー', 'アプリを再起動してください');
        })
        .then(() => { setLoading(false); });
    }
    return cleanup;
  }, [user]);

  if (memos.length === 0) {
    return (
      <View style={emptyStyles.container}>
        <Loading isLoading={isLoading} />
        <View style={emptyStyles.inner}>
          <Text style={emptyStyles.title}>最初のメモを作成しよう！</Text>
          <Button
            style={emptyStyles.button}
            label="作成する"
            onPress={() => { navigation.navigate('MemoCreate'); }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MemoList memos={memos} />
      <CircleButton
        name="plus"
        onPress={() => { navigation.navigate('MemoCreate'); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
});

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    alignSelf: 'center',
  },
});
