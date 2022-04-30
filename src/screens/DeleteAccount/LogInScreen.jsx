import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert,
} from 'react-native';
import firebase from 'firebase';

import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { translateErrors } from '../../utils';
import UserContext from '../../utils/UserContext';

export default function LogInScreen(props) {
  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const user = useContext(UserContext);

  function handlePress() {
    if (user == null || user.isAnonymous) { return; }
    setLoading(true);
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    user.reauthenticateWithCredential(credential)
      .then(() => {
        navigation.navigate('Confirm');
      })
      .catch((error) => {
        const errorMsg = translateErrors(error.code);
        setLoading(false);
        Alert.alert(errorMsg.title, errorMsg.description);
      });
  }

  return (
    <View style={styles.container}>
      <Loading isLoading={isLoading} />
      <View style={styles.inner}>
        <Text style={styles.title}>アカウントの削除</Text>
        <Text style={styles.description}>アカウントの削除するには再度ログインが必要です。</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => { setEmail(text); }}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email Address"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => { setPassword(text); }}
          autoCapitalize="none"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <Button
          label="Submit"
          onPress={handlePress}
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
  input: {
    fontSize: 16,
    height: 48,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});
