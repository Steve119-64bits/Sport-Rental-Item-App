import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity,
  Button, StyleSheet, Alert
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import imageMap from '../imageMap';

export default function CartScreen ( {navigation}:any ) {
  const [items, setItems] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const USER_ID = 1;
  const API_URL = `http://10.0.2.2:5000/api/cart/${USER_ID}`;

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Failed to load cart:", err));
  }, []);

  const toggleItem = (id: number) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setItems(updated);
  };

  const toggleAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setItems(items.map(item => ({ ...item, selected: newValue })));
  };

  const adjustQuantity = (id: number, delta: number) => {
    const updated = items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setItems(updated);
  };

  const getTotal = () => {
    return items
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    const selectedItems = items.filter(item => item.selected);
  
    if (selectedItems.length === 0) {
      Alert.alert("No items selected");
      return;
    }
  
    Alert.alert(
      "Confirm Checkout",
      `Are you sure you want to checkout ${selectedItems.length} item(s)?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            const remainingItems = items.filter(item => !item.selected);
  
            fetch(API_URL, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(remainingItems),
            })
              .then(() => {
                setItems(remainingItems);
                Alert.alert("✅ Checkout complete!", "Proceeding to payment...");
                navigation.navigate('Payment');
              })
              .catch(err => {
                console.error("Checkout error:", err);
                Alert.alert("Error", "Something went wrong.");
              });
          }
        }
      ]
    );
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <CheckBox value={item.selected} onValueChange={() => toggleItem(item.id)} />
      <Image source={imageMap[item.image] || require('../assets/default.webp')} style={styles.image}/>
      <View style={{ flex: 1 }}>
        <Text>{item.name}</Text>
        <Text>RM {item.price.toFixed(2)}</Text>
        <View style={styles.qtyRow}>
          <Button title="-" onPress={() => adjustQuantity(item.id, -1)} />
          <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
          <Button title="+" onPress={() => adjustQuantity(item.id, 1)} />
        </View>
      </View>
    </View>
  );

  const deleteSelectedItems = () => {
    const remainingItems = items.filter(item => !item.selected);
    setItems(remainingItems);
  
    fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(remainingItems),
    }).catch(err => console.error('Failed to update cart:', err));
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <View style={styles.topBar}>
        <Text style={styles.title}>Your Cart</Text>
        <Button title="Delete" color="red" onPress={deleteSelectedItems} />
      </View>

      <TouchableOpacity onPress={toggleAll} style={{ marginBottom: 10 }}>
        <Text>{selectAll ? "Unselect All" : "Select All"}</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Text style={styles.total}>Total: RM {getTotal()}</Text>
      <Button title="Checkout" onPress={handleCheckout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 10 },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  image: { width: 60, height: 60, marginHorizontal: 10 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
});
