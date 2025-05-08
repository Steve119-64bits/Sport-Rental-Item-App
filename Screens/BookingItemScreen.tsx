import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderWithMenu from '../components/HeaderWithMenu';
import imageMap from '../imageMap';

const BookingItemScreen = ({ route, navigation }) => {
  const { 
    item,
    userName,   // User's name passed from the previous screen
    selectedBranch,  // Selected branch passed from the previous screen
    userId, // User ID passed from the previous screen
   } = route.params;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [durationText, setDurationText] = useState("1");
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

  const handleDurationChange = (text) => {
    setDurationText(text);
  
    const parsed = parseInt(text);
    if (!isNaN(parsed)) {
      setDuration(parsed);
      setTotalPrice(parsed * 10);
    }
  };
  

  const addToCart = async () => {
    const API_URL = `http://10.0.2.2:5000/api/cart/${userId}`; // Ensure this URL is correct and the server is running

    try {
      console.log('Making GET request to:', API_URL);
      const res = await fetch(API_URL);

      // Log the response
      console.log('GET Response Status:', res.status);
      console.log('GET Response Headers:', res.headers);
      


      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Unexpected response:', text);
        Alert.alert('Error', 'Received unexpected response from the server.');
        return;
      }

      const currentItems = await res.json();

      const newItem = {
        name: item.name,
        price: totalPrice,
        quantity: duration,
        selected: true,
        image: item.image,
      };

      const updatedItems = [...currentItems, newItem];
      console.log('Updated items:', updatedItems);

      console.log('Making PUT request to:', API_URL);
      const putRes = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItems),
      });

      console.log('PUT Response Status:', putRes.status);
      if (!putRes.ok) {
        const errorText = await putRes.text();
        console.error('PUT request failed:', errorText);
        Alert.alert('Error', 'Failed to update cart.');
        return;
      }

      Alert.alert('✅ Added to Cart', `${item.name} has been added.`);
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Cart update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Failed to add to cart', errorMessage);
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
        value={durationText}
        onChangeText={handleDurationChange}
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

