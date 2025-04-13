import React, { useState } from 'react';
import UserProfileScreen from './screens/UserProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentHistoryScreen from './screens/PaymentHistoryScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('profile');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'edit':
        return <EditProfileScreen onNavigate={setCurrentScreen} />;
      case 'cart':
        return <CartScreen onNavigate={setCurrentScreen} />;
      case 'checkout':
        return <CheckoutScreen onNavigate={setCurrentScreen} />;
      case 'history':
        return <PaymentHistoryScreen onNavigate={setCurrentScreen} />;
      default:
        return <UserProfileScreen onNavigate={setCurrentScreen} />;
    }
  };

  return renderScreen();
}
