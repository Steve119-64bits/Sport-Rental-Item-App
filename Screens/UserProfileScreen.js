import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { getDBConnection, getUser } from '../utils/database';

export default function UserProfileScreen({ onNavigate }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const db = await getDBConnection();
        const userData = await getUser(db);
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.log('Load error:', error);
        Alert.alert('Failed to load user data');
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          Alert.alert('Logged out');
        },
      },
    ]);
  };

  return (//go to cart button just for me go to cart screen, will del ltr
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name: {user ? `${user.firstName} ${user.lastName}` : ''}</Text>
        <Text style={styles.label}>Phone: {user?.phone ?? ''}</Text>
        <Text style={styles.label}>Email: {user?.email ?? ''}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonSpacing}>
          <Button title="Payment History" onPress={() => onNavigate('history')} />
        </View>
        <View style={styles.buttonSpacing}>
          <Button title="Edit Profile" onPress={() => onNavigate('edit')} />
        </View>
        <View style={styles.buttonSpacing}>
          <Button title="Log Out" onPress={handleLogout} />
        </View>
        <View style={styles.buttonSpacing}>
          <Button title="Go to Cart" onPress={() => onNavigate('cart')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 30,
    alignSelf: 'center',
  },
  infoContainer: {
    marginTop: 200,
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  buttonSpacing: {
    marginVertical: 6,
  },
});
