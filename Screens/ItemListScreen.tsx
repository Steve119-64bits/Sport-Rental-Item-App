import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import HeaderWithMenu from '../components/HeaderWithMenu';
import imageMap from '../imageMap';

interface Item {
  id: number;
  name: string;
  image: string;
  category: string;
}

const ItemListScreen = ({ route, navigation }: any) => {
  const { 
    selectedCategory,
    userName, // Assuming userName is passed in route params
    selectedBranch // Assuming selectedBranch is passed in route params
   } = route.params;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:5000/items?category=${selectedCategory}`);
        if (!response.ok) throw new Error('Server returned an error');
        const fetchedItems = await response.json();
        console.log('Selected category:', selectedCategory);
        console.log('Fetched Items:', fetchedItems);
        setItems(fetchedItems);
      } catch (err) {
        setError('Failed to load items. Please try again later.');
        console.error('Loading items error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [selectedCategory]);

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('BookingItem', 
        { 
          item,
          userName, // Assuming userName is passed in route params
          selectedBranch // Assuming selectedBranch is passed in route params
       })
      }
    >
      <Image
        source={imageMap[item.image] || require('../assets/default.webp')}
        style={styles.image}
      />
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading items...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithMenu navigation={navigation} />
      <Text style={styles.header}>{selectedCategory}</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 15, textAlign: 'center' },
  listContent: { paddingHorizontal: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    elevation: 2,
  },
  image: { width: 80, height: 80, marginRight: 15, resizeMode: 'contain' },
  text: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});

export default ItemListScreen;

