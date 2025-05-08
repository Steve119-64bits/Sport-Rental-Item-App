import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function EditProfileScreen({ navigation }) {
  const [user, setUser] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedId = await AsyncStorage.getItem('userId');
        if (!storedId) {
          console.error('No user ID found in storage');
          return;
        }
        const res = await fetch(`http://10.0.2.2:5000/api/user/${storedId}`);
        const data = await res.json();

        // Store userId and the rest of the data
        setUser({ ...data, userId: storedId });
      } catch (err) {
        console.error('Load error:', err);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!user.userId) {
      console.error('User ID missing');
      return;
    }

    try {
      await fetch(`http://10.0.2.2:5000/api/user/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      navigation.goBack();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={user.firstName}
        onChangeText={text => setUser({ ...user, firstName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={user.lastName}
        onChangeText={text => setUser({ ...user, lastName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={user.phone}
        onChangeText={text => setUser({ ...user, phone: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={text => setUser({ ...user, email: text })}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10 }
});
