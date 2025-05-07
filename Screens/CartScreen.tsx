import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity,
  Button, StyleSheet
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

export default function CartScreen() {
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
    const updatedCart = items.map(item => ({
      ...item,
      selected: item.selected || false
    }));

    fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCart)
    })
    .then(() => {
      alert("Cart updated! Proceeding to checkout...");
    })
    .catch(err => console.error("Checkout error:", err));
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <CheckBox value={item.selected} onValueChange={() => toggleItem(item.id)} />
      <Image source={{ uri: item.image }} style={styles.image} />
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>

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
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 }
});
