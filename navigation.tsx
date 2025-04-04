import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import ItemListScreen from './Screens/ItemListScreen';
import BookingItemScreen from './Screens/BookingItemScreen';
import CartScreen from './Screens/CartScreen';

const Stack = createStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ItemList" component={ItemListScreen} />
    <Stack.Screen name="BookingItem" component={BookingItemScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
  </Stack.Navigator>
);

export default StackNavigator;
