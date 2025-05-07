import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignUp = async () => {
    // Check for empty fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
      alert('Please fill out all fields');
      return;
    }
  
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Invalid email format');
      return;
    }
  
    // Phone number validation
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      alert('Phone number must be 10 to 15 digits and contain only numbers');
      return;
    }
  
    // Password strength validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,12}$/;
    if (!passwordRegex.test(password)) {
      alert('Password must be 8–12 characters long and include at least 1 uppercase letter, 1 special character, and 1 number.');
      return;
    }
  
    // Confirm password match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    try {
      // Sending signup request to backend
      const response = await fetch('http://10.0.2.2:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          f_name: firstName,   // Corresponds to f_name in backend
          l_name: lastName,    // Corresponds to l_name in backend
          email,
          password,
          phone_no: phone,     // Corresponds to phone_no in backend
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If signup successful, navigate to login screen
        alert('Sign up successful! Please log in.');
        navigation.navigate('Login');
      } else {
        // If signup fails, show error
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      alert('Error signing up. Please try again later.');
      console.error('Signup error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sign Up Title */}
      <Text style={styles.signUpTitle}>Sign Up</Text>

      {/* Form Fields */}
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Button title="Sign Up" onPress={handleSignUp} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  signUpTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5, width: '100%' },
  link: { color: 'blue', marginTop: 10, textAlign: 'center' },
});

export default SignUpScreen;
