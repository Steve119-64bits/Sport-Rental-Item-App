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
