import React, {useState} from 'react';
import {Text, View} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen';
import CartScreen from './Screens/CartScreen';
import SignUpScreen from './Screens/SignUpScreen';
import AboutUsScreen from './Screens/AboutUsScreen';
import FeedBackScreen from './Screens/FeedBackScreen';
import ItemListScreen from './Screens/ItemListScreen';
import BookingItemScreen from './Screens/BookingItemScreen';
import UserProfileScreen from './Screens/UserProfileScreen';
import EditProfileScreen from './Screens/EditProfileScreen';
import PaymentScreen from './Screens/PaymentScreen';

import 'react-native-gesture-handler';

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Main" component={BottomTabs} />
      <Stack.Screen name="ItemList" component={ItemListScreen} />
      <Stack.Screen name="BookingItem" component={BookingItemScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />

    </Stack.Navigator>
  </NavigationContainer>
);

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'About Us') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Feedback') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="About Us" component={AboutUsScreen} options={{ headerShown: true }}/>
      <Tab.Screen name="Feedback" component={FeedBackScreen} options={{ headerShown: true }}/>
    </Tab.Navigator>
  );
};

export default App;
