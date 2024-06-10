import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { firebase } from '@/firebase';

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSignIn = async () => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user) {
        const token = await user.getIdToken(); // Get the user's ID token
        setSuccessMessage('Sign in successful!');
        setError(''); // Clear any previous error message upon successful sign-in
        console.log('User token:', token);
        
        // Store the token in AsyncStorage
        await AsyncStorage.setItem('userToken', token);
      } else {
        setError('User not found.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };
  
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  successText: {
    color: 'green',
    marginBottom: 12,
  },
});

export default SignInScreen;
