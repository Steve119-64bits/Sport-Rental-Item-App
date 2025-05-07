import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function EditProfileScreen({ navigation }) {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetch('http://10.0.2.2:5000/api/user/1')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error('Load error:', err));
  }, []);

  const handleSave = () => {
    fetch('http://10.0.2.2:5000/api/user/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    .then(() => navigation.goBack())
    .catch(err => console.error('Save error:', err));
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
