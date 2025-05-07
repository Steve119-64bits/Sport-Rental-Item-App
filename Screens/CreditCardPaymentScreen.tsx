import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const CreditCardPaymentScreen = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const validateAndPay = () => {
    const cardRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    if (!cardRegex.test(cardNumber)) return Alert.alert('Invalid', 'Card number must be 16 digits.');
    if (!expiryRegex.test(expiry)) return Alert.alert('Invalid', 'Expiry must be in MM/YY format.');
    if (!cvvRegex.test(cvv)) return Alert.alert('Invalid', 'CVV must be 3 digits.');
    if (!name) return Alert.alert('Invalid', 'Cardholder name is required.');

    Alert.alert('Success', 'Payment completed!\nYour booking is finalized!', [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Credit Card Payment</Text>
      <TextInput placeholder="Card Number" keyboardType="numeric" maxLength={16} style={styles.input} onChangeText={setCardNumber} />
      <TextInput placeholder="Expiry (MM/YY)" style={styles.input} onChangeText={setExpiry} />
      <TextInput placeholder="CVV" keyboardType="numeric" maxLength={3} secureTextEntry style={styles.input} onChangeText={setCvv} />
      <TextInput placeholder="Cardholder Name" style={styles.input} onChangeText={setName} />
      <TouchableOpacity style={styles.button} onPress={validateAndPay}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreditCardPaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f3f3', padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2a2a72' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginVertical: 10, borderWidth: 1, borderColor: '#ccc' },
  button: { backgroundColor: '#2a2a72', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16 },
});
