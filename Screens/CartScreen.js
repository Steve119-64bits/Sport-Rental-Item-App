import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

export default function CartScreen({ onNavigate }) {
  const [cartItems, setCartItems] = useState([
    //just for example, will change when got item db
    { id: 1, name: 'Wood Table', price: 99.99, quantity: 1, selected: false, image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Chair', price: 49.99, quantity: 2, selected: false, image: 'https://via.placeholder.com/100' }
  ]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelect = (id) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setCartItems(updatedItems);
  };

  const toggleSelectAll = () => {
    const newValue = !selectAll;
    const updatedItems = cartItems.map(item => ({ ...item, selected: newValue }));
    setSelectAll(newValue);
    setCartItems(updatedItems);
  };

  const updateQuantity = (id, amount) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    );
    setCartItems(updatedItems);
  };

  const getTotal = () => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <CheckBox value={item.selected} onValueChange={() => toggleSelect(item.id)} />
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text>{item.name}</Text>
        <Text>RM {item.price.toFixed(2)}</Text>
        <View style={styles.quantityControl}>
          <Button title="-" onPress={() => updateQuantity(item.id, -1)} />
          <Text>{item.quantity}</Text>
          <Button title="+" onPress={() => updateQuantity(item.id, 1)} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="←" onPress={() => onNavigate('profile')} />
        <Text style={styles.title}>Cart</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Select All</Text>
          <CheckBox value={selectAll} onValueChange={toggleSelectAll} />
        </View>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />

      <Text style={styles.total}>Total: RM {getTotal()}</Text>
      <Button title="Checkout" onPress={() => onNavigate('checkout')} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      marginBottom: 16, // 加大每个 item 的间距
      backgroundColor: '#f9f9f9',
    },
    image: {
      width: 80,
      height: 80,
      marginHorizontal: 12,
      borderRadius: 8,
    },
    info: {
      flex: 1,
      paddingLeft: 8,
    },
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      gap: 6, // React Native 0.71+ 支持 gap，可加一点空间
    },
    total: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 12,
      textAlign: 'center',
    },
  });
  
