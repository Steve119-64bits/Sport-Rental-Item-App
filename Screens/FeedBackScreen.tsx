import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function FeedbackScreen() {
  const [message, setMessage] = useState('');

  const submitFeedback = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your feedback.');
      return;
    }

    try {
      await firestore()
        .collection('feedback')
        .add({
          message,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert('Thank you!', 'Your feedback has been sent.');
      setMessage('');
    } catch (err) {
      console.error('Firestore error:', err);
      Alert.alert('Error', 'Could not send feedback. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your feedback here…"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Button title="Submit Feedback" onPress={submitFeedback} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    textAlignVertical: 'top',
},
});

