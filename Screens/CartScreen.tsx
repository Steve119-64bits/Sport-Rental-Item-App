import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity,
  Button, StyleSheet, Alert
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import imageMap from '../imageMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from '../utils/getUserId';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selected: boolean;
}
export default function CartScreen ( {navigation}:any ) {
  const [items, setItems] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const id = await getUserId();
      if (!id) {
        Alert.alert('Login required', 'Please sign in first.');
        navigation.replace('Login');
        return;
      }
      setUserId(id);
    })();
  }, []);

  useEffect(() => {
    if (userId === null) return;

    const API_URL = `http://10.0.2.2:5000/api/cart/${userId}`;
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error('Failed to load cart:', err));
  }, [userId]);

  const apiUrl = userId !== null ? `http://10.0.2.2:5000/api/cart/${userId}` : '';

  const toggleItem = (id: number) => {
    setItems((prev)=>
      prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item,)
    );
  };

  const toggleAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setItems((prev)=>
      prev.map(item => ({ ...item, selected: newValue })));
  };

  const adjustQuantity = (id: number, delta: number) => {
    const updated = items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setItems(updated);
  };

  const getTotal = () =>
    items
      .filter((i) => i.selected)
      .reduce((sum, i) => sum + i.price * i.quantity, 0)
      .toFixed(2);

  const deleteSelectedItems = () => {
    const remainingItems = items.filter((i) => !i.selected);
    setItems(remainingItems);
    fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(remainingItems),
    }).catch((err) => console.error('Failed to update cart:', err));
  };

  const handleCheckout = () => {
    const selected = items.filter(i => i.selected);
    if (selected.length === 0) {
      Alert.alert('No items selected');
      return;
    }
  
    Alert.alert(
      'Confirm Checkout',
      `Are you sure you want to checkout ${selected.length} item(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            const remaining = items.filter(i => !i.selected);
  
            // 1) Update server/cart
            fetch(apiUrl, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(remaining),
            })
              .then(() => {
                setItems(remaining);
  
                // 2) Navigate with all the params PaymentScreen needs
                navigation.navigate('Payment', {
                  item: selected[0],
                  // Make sure you have these in scope (or pull them in from route/context)

                  // If you have real pickers for date/time, use those values here:
                  date: new Date().toISOString(),
                  time: new Date().toISOString(),
                  duration: selected[0].duration ?? 1,
                  totalPrice: parseFloat(getTotal()),
                });
              })
              .catch(err => {
                console.error('Checkout error:', err);
                Alert.alert('Error', 'Something went wrong.');
              });
          },
        },
      ],
    );
  };
  

  /* ---------- Render ---------- */
  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.item}>
      <CheckBox value={item.selected} onValueChange={() => toggleItem(item.id)} />
      <Image
        source={imageMap[item.image] || require('../assets/default.webp')}
        style={styles.image}
      />
      <View style={{ flex: 1 }}>
        <Text>{item.name}</Text>
        <Text>RM {item.price.toFixed(2)}</Text>
        <View style={styles.qtyRow}>
          <Button title="-" onPress={() => adjustQuantity(item.id, -1)} />
          <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
          <Button title="+" onPress={() => adjustQuantity(item.id, +1)} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Your Cart</Text>
        <Button title="Delete" color="red" onPress={deleteSelectedItems} />
      </View>

      <TouchableOpacity onPress={toggleAll} style={{ marginBottom: 10 }}>
        <Text>{selectAll ? 'Unselect All' : 'Select All'}</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderItem}
      />

      <Text style={styles.total}>Total: RM {getTotal()}</Text>
      <Button title="Checkout" onPress={handleCheckout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  image: { width: 60, height: 60, marginHorizontal: 10 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
});

