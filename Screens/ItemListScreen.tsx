import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import HeaderWithMenu from '../components/HeaderWithMenu';

const itemsData = {
  Paddles: [
    { id: '1', name: 'Wooden Paddle', image: require('../assets/wood_paddle.png') },
    { id: '2', name: 'Graphite Paddle', image: require('../assets/graphite_paddle.png') },
    { id: '3', name: 'Composite Paddle', image: require('../assets/composite_paddle.png') },
  ],
  Pickleball: [
    { id: '4', name: 'Outdoor Pickleball', image: require('../assets/outdoor_pickleball.png') },
    { id: '5', name: 'Indoor Pickleball', image: require('../assets/indoor_pickleball.png') },
  ],
  Net: [
    { id: '6', name: 'Nylon Net', image: require('../assets/nylon_net.png') },
    { id: '7', name: 'Polyethylene Net', image: require('../assets/polyethylene_net.png') },
  ],
};

const ItemListScreen = ({ route, navigation }) => {
  const { selectedCategory, userName, selectedBranch } = route.params;
  const items = itemsData[selectedCategory] || [];

  return (
    <View style={styles.container}>
      {/* Header with Menu */}
      <HeaderWithMenu navigation={navigation} />

      <Text style={styles.header}>{selectedCategory}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => 
            navigation.navigate('BookingItem', 
              {
               item,
               userName,
               selectedBranch 
              })
            }
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 15, textAlign: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 10 },
  image: { width: 80, height: 80, marginRight: 15, resizeMode: 'contain' },
  text: { fontSize: 18, fontWeight: 'bold' }, 
});

export default ItemListScreen;
