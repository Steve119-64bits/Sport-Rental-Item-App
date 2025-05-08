import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderWithMenu from '../components/HeaderWithMenu';
import imageMap from '../imageMap';

const BookingItemScreen = ({ route, navigation }) => {
  const { 
    item,
    userName,   // User's name passed from the previous screen
    selectedBranch  // Selected branch passed from the previous screen
   } = route.params;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(1);
  const [totalPrice, setTotalPrice] = useState(10);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    setTotalPrice(newDuration * 10);
  };

  const addToCart = async () => {
    const USER_ID = 1;
    const API_URL = `http://10.0.2.2:5000/api/cart/${USER_ID}`;
  
    try {
      const res = await fetch(API_URL);
      const currentItems = await res.json();
  
      const newItem = {
        name: item.name,
        price: totalPrice,
        quantity: duration,
        selected: true,
        image: item.image,
      };
  
      const updatedItems = [...currentItems, newItem];
  
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItems),
      });
  
      Alert.alert('✅ Added to Cart', `${item.name} has been added.`);
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Cart update error:', error);
      Alert.alert('Failed to add to cart', error.message);
    }
  };
  

  const proceedToPayment = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item,
          selectedBranch, // Pass selected branch to Payment screen
          userName, // Pass user name to Payment screen
          date: date.toISOString(),
          time: time.toISOString(),
          duration,
          totalPrice,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('✅ Booking Confirmed', result.message);
        navigation.navigate('Payment', { 
          item,
          selectedBranch, // Pass selected branch to Payment screen
          userName, // Pass user name to Payment screen
          date: date.toISOString(),     // serialized
          time: time.toISOString(),     // serialized
          duration, 
          totalPrice });
      } else {
        throw new Error(result.message || 'Failed to confirm booking');
      }
    } catch (error) {
      Alert.alert('❌ Error', error.message);
      console.error('Booking error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderWithMenu navigation={navigation} />

      <Image source={imageMap[item.image] || require('../assets/default.webp')} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>

      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>Start Date: {date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
        <Text>Start Time: {time.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker value={time} mode="time" display="default" onChange={handleTimeChange} />
      )}

      <Text style={styles.label}>Duration (hours):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={duration.toString()}
        onChangeText={(text) => handleDurationChange(parseInt(text) || 1)}
      />

      <Text style={styles.totalPrice}>Total: RM{totalPrice}</Text>

      <TouchableOpacity style={styles.cartButton} onPress={addToCart}>
        <Text style={styles.cartText}>Add to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.payButton} onPress={proceedToPayment}>
        <Text style={styles.payText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  image: { width: 150, height: 150, marginBottom: 15, resizeMode: 'contain' },
  label: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  input: { width: '80%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginTop: 10, textAlign: 'center' },
  totalPrice: { fontSize: 20, fontWeight: 'bold', marginTop: 10, color: '#28a745' },
  cartButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 15, width: '80%', alignItems: 'center' },
  cartText: { color: '#fff', fontSize: 18 },
  payButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginTop: 10, width: '80%', alignItems: 'center' },
  payText: { color: '#fff', fontSize: 18 },
});

export default BookingItemScreen;

