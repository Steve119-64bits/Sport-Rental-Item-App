import React from 'react';
import {Text, View} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen';
import AboutUsScreen from './Screens/AboutUsScreen';
import FeedBackScreen from './Screens/FeedBackScreen';
import ItemListScreen from './Screens/ItemListScreen';
import BookingItemScreen from './Screens/BookingItemScreen';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          options={{
            headerShown: false,
          }}
          component={BottomTabs}
        />
        <Stack.Screen
          name="ItemList"
          component={ItemListScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="BookingItem"
          component={BookingItemScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

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