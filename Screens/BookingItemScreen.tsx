import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HeaderWithMenu from '../components/HeaderWithMenu';

const BookingItemScreen = ({ route, navigation }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
        <HeaderWithMenu navigation={navigation} />
      <Text style={styles.title}>Booking: {item}</Text>
      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart', { item })}>
        <Text style={styles.cartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  cartButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 20 },
  cartText: { color: '#fff', fontSize: 18 }
});

export default BookingItemScreen;
