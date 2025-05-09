import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import ItemListScreen from './Screens/ItemListScreen';
import BookingItemScreen from './Screens/BookingItemScreen';
import CartScreen from './Screens/CartScreen';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import PaymentScreen from './Screens/PaymentScreen';
import CreditCardPaymentScreen from './Screens/CreditCardPaymentScreen';
import EWalletPaymentScreen from './Screens/EWalletPaymentScreen';
import OnlineBankingPaymentScreen from './Screens/OnlineBankingPaymentScreen';
import AboutUsScreen from './Screens/AboutUsScreen';
import FeedbackScreen from './Screens/FeedbackScreen';

const Stack = createStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ItemList" component={ItemListScreen} />
    <Stack.Screen name="BookingItem" component={BookingItemScreen} />
    <Stack.Screen name="About" component={AboutUsScreen} />
    <Stack.Screen name="Feedback" component={FeedbackScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="CreditCardPayment" component={CreditCardPaymentScreen} />
    <Stack.Screen name="EWalletPayment" component={EWalletPaymentScreen} />
    <Stack.Screen name="OnlineBankingPayment" component={OnlineBankingPaymentScreen} />
  </Stack.Navigator>
);

export default StackNavigator;
