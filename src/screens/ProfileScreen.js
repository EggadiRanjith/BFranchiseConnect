import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import BottomNavbar from '../components/BottomNavBar';
import useUserData from '../components/useUserData';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ProfilePage = () => {
  const { userProfileData, fetchUserData } = useUserData();
  const [userType, setUserType] = useState('');
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    // Fetch user data only if it hasn't been fetched yet
    if (!userProfileData) {
      fetchUserData();
    } else {
      setUserType(userProfileData.user_type);
    }
  }, [userProfileData, fetchUserData]);

  const navigateToUserProfile = () => {
    navigation.navigate('UserProfileContent', { profileType: 'user' });
  };

  const navigateToBusiness = () => {
    const verificationStatus = userProfileData?.verification_status;
    if (verificationStatus === 'pending') {
      navigation.navigate('bussinessform');
    } else {
      navigation.navigate('Bussinessprofile', { profileType: 'business' });
    }
  };

  const navigateToBusinessAndFranchiseProfile = () => {
    if (userProfileData) {
      if (userProfileData.user_type === 'business') {
        const verificationStatus = userProfileData?.business?.admin_approval_status;
        if (verificationStatus === 'agreed') {
          const businessId = userProfileData?.business?.business_id; 
          navigation.navigate('BusinessProfileContent', { business_id: businessId });
        } else {
          setModalMessage('Verification pending for your business.');
          setModalVisible(true);
        }
      } else if (userProfileData.user_type === 'franchise') {
        navigation.navigate('hu', { user_id: userProfileData.user_id });
        
      } else {
        setModalMessage('Connect to a franchise.');
        setModalVisible(true);
      }
    }
  };
  
  // Function to handle logout
// Function to handle logout
const handleLogout = async () => {
  try {
    // Clear user data from AsyncStorage
    await clearUserData();
    // Navigate to the login screen
    navigation.navigate('LoginScreen');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

// Function to clear user data and reset authentication state
const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('userId'); // Remove the user ID
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="Franchiseconnect" titleStyle={styles.appBarTitle} />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
          <FontAwesome5 name="sign-out-alt" size={20} color="white" style={styles.logoutIcon} />
        </TouchableOpacity>
      </Appbar.Header>
      <View style={styles.contentContainer}>
        <Button
          mode="contained"
          onPress={navigateToUserProfile}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Go to User Profile
        </Button>
        {userType === 'business' && (
          <Button
            mode="contained"
            onPress={navigateToBusiness}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Your Business Details
          </Button>
        )}
        <Button
          mode="contained"
          onPress={navigateToBusinessAndFranchiseProfile}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Business & Franchise Profile
        </Button>
      </View>
      <BottomNavbar />
      {/* Modal for displaying messages */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FontAwesome5 name="exclamation-circle" size={24} color="red" style={styles.modalIcon} />
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  appBar: {
    backgroundColor: '#3498db',
    elevation: 5,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutText: {
    color: 'white',
    marginRight: 4,
    fontSize: 16,
  },
  logoutIcon: {
    marginRight: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    marginVertical: 10,
    width: '80%',
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfilePage;
