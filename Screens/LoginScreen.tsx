import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const handleLogin = async () => {
    // Handle login logic (dummy logic in this case)
    if (email && password) {
      // Simulate a successful login
      const userName = await AsyncStorage.getItem('userName');
      
      if (userName) {
        // Navigate to HomeScreen with userName
        navigation.replace('Home', { userName: userName });
      } else {
        alert('User name not found');
      }
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={secure}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.toggleContainer}>
          <Text style={styles.toggle}>{secure ? 'Show' : 'Hide'}</Text>
        </TouchableOpacity>
      </View>
      
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign up here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  input: { 
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 5, 
    width: '100%' 
  },
  passwordContainer: {
    position: 'relative', 
    width: '100%', 
    marginBottom: 15
  },
  toggleContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggle: { 
    color: 'blue', 
    fontSize: 16 
  },
  link: { 
    color: 'blue', 
    marginTop: 10, 
    textAlign: 'center' 
  },
  logo: {
    width: 300, // Adjust the size as needed
    height: 100, // Adjust the size as needed
    marginBottom: 30, // Space between logo and email input
  },
});

export default LoginScreen;
