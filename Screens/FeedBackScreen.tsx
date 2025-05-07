import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { getDBConnection, createFeedbacksTable, addFeedback, getAllFeedbacks } from '../backend/createFeedback';

export default function FeedbackForm() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        async function setupDB() {
            const db = await getDBConnection();
            await createFeedbacksTable(db);
        }
        setupDB();
    }, []);

    const handleSubmit = async () => {
        if (!name || !phone || !email || !description) {
            Alert.alert('All fields are required.');
            return;
        }

        try {
            const db = await getDBConnection();
            await addFeedback(db, name, phone, email, description);

            //Fetch all the data from feedbacks table and log it to console bar
            const feedbacks = await getAllFeedbacks(db);
            console.log('--- All Feedbacks Stored in DB ---');
            feedbacks.forEach((item, index) => {
                console.log(`${index + 1}. Name: ${item.name}, Phone: ${item.phone}, Email: ${item.email}, Description: ${item.description}`);
            });
            console.log('----------------------------');

            Alert.alert('Feedback submitted successfully!');

            // Clear all form
            setName('');
            setPhone('');
            setEmail('');
            setDescription('');
        } catch (error) {
            console.error(error);
            Alert.alert('Failed to submit feedback.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Send us your feedback!</Text>
            <Text style={styles.header2}>Do you have any suggestion to improve your experience?</Text>
            <Text style={styles.header2}>We would love to hear from you!</Text>
            <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
            <TextInput placeholder="Description" value={description} onChangeText={setDescription} multiline style={[styles.input, { height: 100 }]} />

            <Button title="Submit Feedback" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    header:{
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 20,
        textAlign: 'left',
        color: '#333',
    },
    header2:{
        fontSize: 15,
        marginBottom: 20,
        color: '#333',
    },
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#999',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});
