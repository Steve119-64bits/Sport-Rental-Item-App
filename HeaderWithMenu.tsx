import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';

const branches = ['Branch 1', 'Branch 2', 'Branch 3', 'Branch 4'];

const HeaderWithMenu = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [branchMenuVisible, setBranchMenuVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Select Branch');
  const [profilePic, setProfilePic] = useState(require('../assets/profile.png'));
  const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = useState(new Animated.Value(0))[0];

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? 0 : 250,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setMenuVisible(!menuVisible);
  };


  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        setProfilePic({ uri: response.assets[0].uri });
      }
    });
  };

  return (
    <>
      {/* Left Menu */}
      {menuVisible && (
        <View style={styles.menu}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image source={profilePic} style={styles.profilePic} />
            </TouchableOpacity>
            <Text style={styles.profileName}>Yun Sheng</Text>
          </View>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Icon name="bars" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.menuItem}>Home</Text>
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
        </View>
      )}

      {/* Header */}
      <Animated.View style={[styles.header, { transform: [{ translateX: slideAnim }] }]}>
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
      
          {/* Cart Icon */}
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Icon name="shopping-cart" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Animated.View>

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
    </>
  );
};

const styles = StyleSheet.create({
  menu: { position: 'absolute', top: 0, left: 0, width: 250, height: '100%', backgroundColor: '#fff', padding: 20, zIndex: 2 },
  closeButton: { padding: 10, alignSelf: 'flex-end' },
  menuItem: { fontSize: 18, paddingVertical: 10 },
  profileContainer: { alignItems: 'center', marginBottom: 20 },
  profilePic: { width: 80, height: 80, borderRadius: 40 },
  profileName: { fontSize: 20, fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, padding: 10, backgroundColor: '#fff' },
  searchBar: { flex: 1, marginHorizontal: 10, padding: 8, borderWidth: 1, borderRadius: 5 },
  iconContainer: { flexDirection: 'row', alignItems: 'center' },
  branchButton: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  branchText: { marginLeft: 5, fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  branchOption: { padding: 15, width: '100%', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  closeModal: { marginTop: 10, padding: 10, backgroundColor: 'red', borderRadius: 5, width: '100%', alignItems: 'center' },
  closeText: { color: '#fff', fontSize: 16 },
});

export default HeaderWithMenu;
