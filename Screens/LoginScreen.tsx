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
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      // Sending login request to backend
      const response = await fetch('http://10.0.2.2:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // If login successful, save user info and navigate
        await AsyncStorage.setItem('USER_ID', data.user.id.toString());
        await AsyncStorage.setItem('userName', data.user.f_name); // Store user's first name for example
        navigation.replace('Main', {
          screen: 'Home',
          params: { userName: data.user.f_name }
        });
      } else {
        // If login fails, show error
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      alert('Error logging in. Please try again later.');
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image source={require('../assets/companyLogo.png')} style={styles.logo} />

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
    width: 300, // Adjusted size to make the logo smaller
    height: 250, // Adjusted size to make the logo smaller
    marginBottom: 30, // Space between logo and email input
    borderWidth: 0, // Add border to the logo
    borderColor: 'gray', // Set border color
  },
});

export default LoginScreen;

