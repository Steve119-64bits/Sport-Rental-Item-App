import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderWithMenu from '../components/HeaderWithMenu';

const BookingItemScreen = ({ route, navigation }) => {
  const { item } = route.params; // item object { id, name, image }
  
  // States for date, time, and duration
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(1); // Default duration in hours
  const [totalPrice, setTotalPrice] = useState(10); // Base price RM10 per hour

  // State to control date & time picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Function to handle date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Function to handle time change
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  // Function to handle duration selection
  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    setTotalPrice(newDuration * 10); // Assuming RM10 per hour
  };

  // Function to add to cart
  const addToCart = () => {
    Alert.alert('Added to Cart', `${item.name} has been added to your cart.`);
    navigation.navigate('Cart', { item, date, time, duration, totalPrice });
  };

  // Function to proceed to payment
  const proceedToPayment = () => {
    Alert.alert('Proceeding to Payment', `Total: RM${totalPrice}`);
    navigation.navigate('Payment', { item, date, time, duration, totalPrice });
  };

  return (
    <View style={styles.container}>
      <HeaderWithMenu navigation={navigation} />

      {/* Item Image & Name */}
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>

      {/* Start Date Picker */}
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>Start Date: {date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
      )}

      {/* Start Time Picker */}
      <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
        <Text>Start Time: {time.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker value={time} mode="time" display="default" onChange={handleTimeChange} />
      )}

      {/* Duration Selection */}
      <Text style={styles.label}>Duration (hours):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={duration.toString()}
        onChangeText={(text) => handleDurationChange(parseInt(text) || 1)}
      />

      {/* Total Price Display */}
      <Text style={styles.totalPrice}>Total: RM{totalPrice}</Text>

      {/* Add to Cart Button */}
      <TouchableOpacity style={styles.cartButton} onPress={addToCart}>
        <Text style={styles.cartText}>Add to Cart</Text>
      </TouchableOpacity>

      {/* Proceed to Payment Button */}
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
  payText: { color: '#fff', fontSize: 18 }
});

export default BookingItemScreen;
