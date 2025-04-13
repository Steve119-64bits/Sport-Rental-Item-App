import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getDBConnection, createTable, saveUser } from '../utils/database';

export default function EditProfileScreen({ onNavigate }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const validateInput = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName || !lastName || !phone || !email) {
      Alert.alert('Please fill in all fields');
      return false;
    }

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      Alert.alert('Name must contain only letters');
      return false;
    }

    if (!phoneRegex.test(phone)) {
      Alert.alert('Phone number must contain only numbers');
      return false;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Invalid email format');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateInput()) return;

    try {
      const db = await getDBConnection();
      await createTable(db);
      await saveUser(db, firstName, lastName, phone, email);
      Alert.alert('Profile saved!');
      onNavigate('profile');
    } catch (error) {
      console.log('Save error:', error);
      Alert.alert('Save failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text>First Name:</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      <Text>Last Name:</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      <Text>Phone:</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <View style={styles.buttonGroup}>
        <View style={styles.buttonSpacing}>
          <Button title="Save" onPress={handleSave} />
        </View>
        <View style={styles.buttonSpacing}>
          <Button title="Back" onPress={() => onNavigate('profile')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 6,
  },
  buttonGroup: {
    marginTop: 20,
  },
  buttonSpacing: {
    marginVertical: 6,
  },
});
