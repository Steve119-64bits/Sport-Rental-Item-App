import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

 
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const res = await fetch(`http://10.0.2.2:5000/api/user/${userId}`);
          const data = await res.json();
          setUser(data);
        } else {
          console.error('No user ID found in storage');
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };
  
    useEffect(() => {
      loadUser();
  
      // Listen for when the screen comes into focus
      const focusListener = navigation.addListener('focus', () => {
        loadUser(); // Reload user data when screen becomes active
      });
  
      // Clean up the listener when the component unmounts
      return focusListener;
    }, [navigation]);

  if (!user) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.label}>Username: {user.firstName} {user.lastName}</Text>
      <Text style={styles.label}>Phone: {user.phone}</Text>
      <Text style={styles.label}>Email: {user.email}</Text>
      <View style={styles.buttons}>
        <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
}

const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes', onPress: async () => {
            await AsyncStorage.clear(); 
            navigation.replace('Login'); 
          }
        }
      ]
    );
  };
  

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  buttons: { marginTop: 20, gap: 10 }
});
