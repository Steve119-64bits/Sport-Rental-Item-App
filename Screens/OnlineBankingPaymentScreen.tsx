import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const OnlineBankingPaymentScreen = ({ route, navigation }) => {
  const [open, setOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [banks] = useState([
    { label: 'Maybank', value: 'Maybank' },
    { label: 'CIMB Bank', value: 'CIMB' },
    { label: 'Public Bank', value: 'PublicBank' },
    { label: 'RHB Bank', value: 'RHB' },
    { label: 'HSBC', value: 'HSBC' },
  ]);

  const [bankUsername, setBankUsername] = useState('');
  const [bankPassword, setBankPassword] = useState('');

  const validateAndPay = () => {
    if (!selectedBank) {
      return Alert.alert('Missing Bank', 'Please select your bank.');
    }

    if (!bankUsername.trim()) {
      return Alert.alert('Invalid', 'Username cannot be empty.');
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(bankPassword)) {
      return Alert.alert(
        'Invalid Password',
        'Password must be at least 8 characters and include both letters and numbers.'
      );
    }

    Alert.alert('Success', 'Online Banking payment successful!\nYour booking is finalized!', [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Online Banking</Text>

        <Text style={styles.label}>Select Bank:</Text>
        <View style={{ zIndex: 1000, marginBottom: 20 }}>
          <DropDownPicker
            open={open}
            value={selectedBank}
            items={banks}
            setOpen={setOpen}
            setValue={setSelectedBank}
            setItems={() => {}}
            placeholder="Choose your bank"
            style={styles.dropdown}
            dropDownContainerStyle={{ borderColor: '#ccc' }}
          />
        </View>

        <TextInput
          placeholder="Bank Username"
          style={styles.input}
          onChangeText={setBankUsername}
          value={bankUsername}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={setBankPassword}
          value={bankPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={validateAndPay}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OnlineBankingPaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8eaf6' },
  inner: { padding: 20, paddingTop: 40, flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#303f9f', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#303f9f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16 },
});
