import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderWithMenu from '../components/HeaderWithMenu';
import imageMap from '../imageMap';
import { getUserId } from '../utils/getUserId';

const BookingItemScreen = ({ route, navigation }) => {
  const { item, selectedBranch, userName } = route.params ?? {};

  /* ---------------- user ID resolution ---------------- */
  const [userId, setUserId] = useState<number | null>(
    route.params?.userId ?? null,
  );

  useEffect(() => {
    if (userId === null) {
      (async () => setUserId(await getUserId()))();
    }
  }, []);

  /* ---------------- booking state ---------------- */
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [durationText, setDurationText] = useState('1');
  const [duration, setDuration] = useState(1);
  const [totalPrice, setTotalPrice] = useState(10);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  /* ---------------- handlers ---------------- */
  const handleDurationChange = (text: string) => {
    setDurationText(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed)) {
      setDuration(parsed);
      setTotalPrice(parsed * 10);
    }
  };

  const addToCart = async () => {
    if (userId === null) {
      Alert.alert('Login required', 'Please sign in first.');
      navigation.replace('Login');
      return;
    }

    const API_URL = `http://10.0.2.2:5000/api/cart/${userId}`;

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch current cart');
      const currentItems = await res.json();

      const newItem = {
        name: item.name,
        price: totalPrice,
        quantity: duration,
        selected: true,
        image: item.image,
      };

      const updatedItems = [...currentItems, newItem]; // typo fixed

      const putRes = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItems),
      });

      if (!putRes.ok) throw new Error('PUT request failed');

      Alert.alert('✅ Added to Cart', `${item.name} has been added.`);
      navigation.navigate('Cart');
    } catch (err) {
      console.error('Cart update error:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const proceedToPayment = async () => {
    try {
      const res = await fetch('http://10.0.2.2:5000/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item,
          selectedBranch,
          userName,
          date: date.toISOString(),
          time: time.toISOString(),
          duration,
          totalPrice,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Booking failed');

      Alert.alert('✅ Booking Confirmed', json.message);
      navigation.navigate('Payment', {
        item,
        selectedBranch,
        userName,
        date: date.toISOString(),
        time: time.toISOString(),
        duration,
        totalPrice,
      });
    } catch (err) {
      Alert.alert('❌ Error', err instanceof Error ? err.message : 'Unknown');
    }
  };

  /* ---------------- render ---------------- */
  return (
    <View style={styles.container}>
      <HeaderWithMenu navigation={navigation} />
      <Image
        source={imageMap[item.image] || require('../assets/default.webp')}
        style={styles.image}
      />
      <Text style={styles.title}>{item.name}</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}>
        <Text>Start Date: {date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, d) => {
            setShowDatePicker(false);
            if (d) setDate(d);
          }}
        />
      )}

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowTimePicker(true)}>
        <Text>Start Time: {time.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(_, t) => {
            setShowTimePicker(false);
            if (t) setTime(t);
          }}
        />
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
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  image: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 15 },
  label: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
    textAlign: 'center',
  },
  totalPrice: { fontSize: 20, fontWeight: 'bold', marginTop: 10, color: '#28a745' },
  cartButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    width: '80%',
    alignItems: 'center',
  },
  cartText: { color: '#fff', fontSize: 18 },
  payButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  payText: { color: '#fff', fontSize: 18 },
});

export default BookingItemScreen;
