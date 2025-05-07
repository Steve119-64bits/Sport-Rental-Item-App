/*
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import HeaderWithMenu from '../components/HeaderWithMenu';

const PaymentScreen = ({ route, navigation }) => {
  const { item, date, time, duration, totalPrice } = route.params;

  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [items, setItems] = useState([
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'E-Wallet', value: 'e_wallet' },
    { label: 'Online Banking', value: 'online_banking' },
  ]);

  const handlePayment = () => {
    if (!paymentMethod) {
      Alert.alert('Please select a payment method');
      return;
    }

    navigation.navigate(
      paymentMethod === 'credit_card'
        ? 'CreditCardPayment'
        : paymentMethod === 'e_wallet'
        ? 'EWalletPayment'
        : 'OnlineBankingPayment',
      { item, date, time, duration, totalPrice }
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithMenu navigation={navigation} />
      <Text style={styles.title}>Payment</Text>

      <Text style={styles.label}>Select Payment Method:</Text>
      <DropDownPicker
        open={open}
        value={paymentMethod}
        items={items}
        setOpen={setOpen}
        setValue={setPaymentMethod}
        setItems={setItems}
        placeholder="Choose a payment method"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <View style={styles.details}>
        <Text>Item: {item.name}</Text>
        <Text>Date: {new Date(date).toDateString()}</Text>
        <Text>Time: {new Date(time).toLocaleTimeString()}</Text>
        <Text>Duration: {duration} hour(s)</Text>
        <Text style={styles.total}>Total: RM{totalPrice}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  dropdown: { borderColor: '#ccc' },
  dropdownContainer: { borderColor: '#ccc' },
  details: { marginTop: 20 },
  total: { marginTop: 10, fontSize: 18, fontWeight: 'bold', color: '#28a745' },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, marginTop: 30, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default PaymentScreen;
*/

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import HeaderWithMenu from '../components/HeaderWithMenu';
import DropDownPicker from 'react-native-dropdown-picker';
import imageMap from '../imageMap';

const PaymentScreen = ({ route, navigation }) => {
  const { item, selectedBranch, userName, date, time, duration, totalPrice } = route.params;

  // for debugging purposes
  console.log('selectedBranch:', selectedBranch);
  console.log('userName:', userName);

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [open, setOpen] = useState(false); // State to control dropdown open/close

  const handleConfirmPayment = () => {
    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method.');
      return;
    }

    const paymentData = {
        item,
        date: new Date(date).toISOString(),  // converted to string
        time: new Date(time).toISOString(),  // converted to string
        duration,
        totalPrice,
        selectedBranch,
        userName,
        paymentMethod,
      };
    
    switch (paymentMethod) {
        case 'Credit Card':
          navigation.navigate('CreditCardPayment', paymentData);
          break;
        case 'TNG eWallet':
          navigation.navigate('EWalletPayment', paymentData);
          break;
        case 'Online Banking':
          navigation.navigate('OnlineBankingPayment', paymentData);
          break;
        default:
          Alert.alert('Error', 'Invalid payment method selected.');
    }
  };

  return (
    <View style={styles.container}>
      <HeaderWithMenu navigation={navigation} />

      <Text style={styles.header}>Payment Details</Text>

      <View style={styles.detailsWrapper}>
        <Image
          source={imageMap[item.image] || require('../assets/default.webp')} // Safe image source
          style={styles.image}
        />
        <Text style={styles.itemName}>{item.name}</Text>

        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Branch: <Text style={styles.detailText}>{selectedBranch}</Text></Text>
          <Text style={styles.detailLabel}>User: <Text style={styles.detailText}>{userName}</Text></Text>
          <Text style={styles.detailLabel}>Start Date: <Text style={styles.detailText}>{new Date(date).toDateString()}</Text></Text>
          <Text style={styles.detailLabel}>Start Time: <Text style={styles.detailText}>{new Date(time).toLocaleTimeString()}</Text></Text>
          <Text style={styles.detailLabel}>Duration: <Text style={styles.detailText}>{duration} hour(s)</Text></Text>
          <Text style={styles.detailLabel}>Total Price: <Text style={styles.total}>RM{totalPrice}</Text></Text>
        </View>

        <Text style={styles.paymentLabel}>Select Payment Method:</Text>
        <DropDownPicker
          open={open} // Controlled open state
          value={paymentMethod}
          items={[
            { label: 'Online Banking', value: 'Online Banking' },
            { label: 'TNG eWallet', value: 'TNG eWallet' },
            { label: 'Credit Card', value: 'Credit Card' },
          ]}
          setOpen={setOpen} // Allow dropdown to open/close
          setValue={setPaymentMethod} // Set selected payment method
          style={styles.picker}
          placeholder="Select payment method"
        />

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
          <Text style={styles.confirmText}>Confirm Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10},   
  image: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 10 },
  itemName: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  detailsWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  detailBox: { width: '100%', padding: 10, backgroundColor: '#f2f2f2', borderRadius: 10 },
  detailLabel: { fontSize: 14, fontWeight: '600', marginTop: 5 },
  detailText: { fontSize: 14, color: '#333' },
  total: { fontSize: 16, fontWeight: 'bold', color: '#28a745', marginTop: 5 },

  paymentLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  picker: { height: 40, width: '100%', borderRadius: 10, marginTop: 10 },

  confirmButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontSize: 16 },
});

export default PaymentScreen;
