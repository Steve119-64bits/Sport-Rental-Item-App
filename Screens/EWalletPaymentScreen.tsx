import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const EWalletPaymentScreen = ({ navigation }) => {
  const [walletId, setWalletId] = useState('');
  const [pin, setPin] = useState('');

  const validateAndPay = () => {
    const idRegex = /^\d{10,11}$/;
    const pinRegex = /^\d{6}$/;

    if (!idRegex.test(walletId)) return Alert.alert('Invalid', 'Wallet ID must be 10–11 digits.');
    if (!pinRegex.test(pin)) return Alert.alert('Invalid', 'PIN must be exactly 6 digits.');

    Alert.alert('Success', 'E-Wallet payment successful!\nYour booking is finalized!', [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TNG eWallet Payment</Text>

      <TextInput
        placeholder="Wallet Phone Number"
        keyboardType="phone-pad"
        style={styles.input}
        onChangeText={setWalletId}
        value={walletId}
        maxLength={11}
      />

      <TextInput
        placeholder="6-digit PIN"
        keyboardType="numeric"
        secureTextEntry
        style={styles.input}
        onChangeText={setPin}
        value={pin}
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={validateAndPay}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EWalletPaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0f7fa', padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#00796b' },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#00796b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16 },
});