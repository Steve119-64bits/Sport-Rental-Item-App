import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Animated, FlatList, Modal, Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [branchMenuVisible, setBranchMenuVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [profilePic, setProfilePic] = useState(require('../assets/profile.png'));
  const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = useState(new Animated.Value(0))[0];

  // Debugging: Log the userName when it is set
  const route = useRoute();
  const [userName, setUserName] = useState('');

  // Debugging: Log the userName when it is set
  useEffect(() => {
    if (route.params?.userName) {
      setUserName(route.params.userName);
      console.log('User Name set:', route.params.userName); // Debug log
    }
  }, [route.params?.userName]);

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? 0 : 250,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setMenuVisible(!menuVisible);
  };

  const branches = ['Branch 1', 'Branch 2', 'Branch 3', 'Branch 4'];

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    console.log('Selected Branch:', branch);  // for debugging purposes
    setBranchMenuVisible(false);
  };

  const categories = [
    { id: '1', name: 'Paddles', image: require('../assets/paddle.png') },
    { id: '2', name: 'Pickleball', image: require('../assets/pickleball.png') },
    { id: '3', name: 'Net', image: require('../assets/net.png') },
  ];

  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        setProfilePic({ uri: response.assets[0].uri });
      }
    });
  };

  // Logout function to clear user token and navigate to Login screen
  const handleLogout = async () => {
    try {
      // Clear the user session or data from AsyncStorage
      await AsyncStorage.removeItem('userName');  // Remove any session-related data

      // Navigate the user back to the login screen
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout', error);
      alert('Something went wrong during logout.');
    }
  };

  // Function to handle item selection and navigate to ItemList screen
  const handleBookItem = (item) => {
    navigation.navigate('ItemList', {
      selectedCategory: item.name,
      userName: userName,  // Passing userName
      selectedBranch: selectedBranch,  // Passing selectedBranch
    });
  };

  return (
    <View style={styles.container}>
      {/* Left Menu */}
      {menuVisible && (
        <View style={styles.menu}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image source={profilePic} style={styles.profilePic} />
            </TouchableOpacity>
            <Text style={styles.userName}>{userName}</Text> 
          </View>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Icon name="bars" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.menuItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
            <Text style={styles.menuItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.menuItem}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('About')}>
            <Text style={styles.menuItem}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
            <Text style={styles.menuItem}>Contact</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.menuItem}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <Animated.View style={[styles.mainContent, { transform: [{ translateX: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          {!menuVisible && (
            <TouchableOpacity onPress={toggleMenu}>
              <Icon name="bars" size={24} color="black" />
            </TouchableOpacity>
          )}
          <TextInput
            placeholder="Search..."
            style={styles.searchBar}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.iconContainer}>
            {/* Branch Selection */}
            <TouchableOpacity style={styles.branchButton} onPress={() => setBranchMenuVisible(true)}>
              <Icon name="map-marker" size={20} color="black" />
              <Text style={styles.branchText}>
                {selectedBranch ? selectedBranch : 'Select Branch'}
              </Text>
            </TouchableOpacity>
            {/* Cart Icon */}
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <Icon name="shopping-cart" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Branch Selection Modal */}
        <Modal visible={branchMenuVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Branch</Text>
              {branches.map((branch, index) => (
                <TouchableOpacity key={index} onPress={() => handleBranchSelect(branch)} style={styles.branchOption}>
                  <Text style={styles.branchOptionText}>{branch}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setBranchMenuVisible(false)} style={styles.closeModal}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Categories - Disabled if no branch selected */}
        <FlatList
          data={categories.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.item, 
                !selectedBranch && styles.disabledItem // Greyed-out style when disabled
              ]}
              onPress={() => {
                if (selectedBranch) {
                  handleBookItem(item); // Use the handleBookItem function when an item is selected
                  //navigation.navigate('ItemList', { selectedCategory: item.name });
                } else {
                  Alert.alert('Select a Branch', 'Please select a branch before choosing a category.');
                }
              }}
            >
              <Image source={item.image} style={styles.image} />
              <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  menu: { position: 'absolute', top: 0, left: 0, width: 250, height: '100%', backgroundColor: '#fff', padding: 20, zIndex: 2 },
  closeButton: { padding: 10, alignSelf: 'flex-end' },
  menuItem: { fontSize: 18, paddingVertical: 10 },
  profileContainer: { alignItems: 'center', marginBottom: 20 },
  profilePic: { width: 80, height: 80, borderRadius: 40 },
  mainContent: { flex: 1, padding: 20, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  searchBar: { flex: 1, marginHorizontal: 10, padding: 8, borderWidth: 1, borderRadius: 5 },
  iconContainer: { flexDirection: 'row', alignItems: 'center' },
  branchButton: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  branchText: { marginLeft: 5, fontSize: 16, fontWeight: 'bold' },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 10 },
  disabledItem: { backgroundColor: '#ddd' }, // Greyed out when disabled
  image: { width: 80, height: 80, marginRight: 15, resizeMode: 'contain' },
  text: { fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  branchOption: { padding: 15, width: '100%', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  closeModal: { marginTop: 10, padding: 10, backgroundColor: 'red', borderRadius: 5, width: '100%', alignItems: 'center' },
  closeText: { color: '#fff', fontSize: 16 },
  userName: { marginTop: 10, fontSize: 16, fontWeight: 'bold', textAlign: 'center',},
});

export default HomeScreen;
