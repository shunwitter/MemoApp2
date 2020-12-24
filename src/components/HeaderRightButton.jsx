import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { shape, func } from 'prop-types';

import LogOutButton from './LogOutButton';

export default function HeaderRightButton(props) {
  const { currentUser, cleanupFuncs } = props;
  const navigation = useNavigation();
  if (!currentUser) { return null; }
  // 匿名ユーザー
  if (currentUser.isAnonymous) {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignUp' }],
          });
        }}
        style={styles.container}
      >
        <Text style={styles.label}>アカウント登録</Text>
      </TouchableOpacity>
    );
  }
  // メアド登録済ユーザー
  return (
    <LogOutButton cleanupFuncs={cleanupFuncs} />
  );
}

HeaderRightButton.propTypes = {
  currentUser: shape().isRequired,
  cleanupFuncs: shape({
    auth: func,
    memos: func,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
