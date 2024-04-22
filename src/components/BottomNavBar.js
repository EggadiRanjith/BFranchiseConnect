import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { IconButton, Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomNavbar = () => {
  const navigation = useNavigation();
  const [notificationCount, setNotificationCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    refreshNavigationBar();
    getUserType();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in AsyncStorage');
      }
      
      const response = await axios.get(`https://franchiseconnectt.up.railway.app/api/notifications/${userId}`);
      const notifications = response.data;
  
      const unreadCount = notifications.reduce((count, notification) => {
        return notification.read_status === 'unread' ? count + 1 : count;
      }, 0);
  
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const refreshNavigationBar = () => {
    fetchNotifications();
    // Add additional fetch functions for other data if needed
  };

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    refreshNavigationBar();
  };

  const getUserType = async () => {
    try {
      const storedUserType = await AsyncStorage.getItem('user_type');
      if (storedUserType) {
        setUserType(storedUserType);
      }
    } catch (error) {
      console.error('Error getting user type from AsyncStorage:', error);
    }
  };

  const handleUploadPress = () => {
    if (userType !== 'business' && userType !== 'franchise') {
      setModalVisible(true);
    } else {
      navigateToScreen('UploadPostForm');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigateToScreen('Home')}>
        <Ionicons name="home" size={30} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('SearchScreen')}>
        <Ionicons name="search" size={30} style={styles.icon} />
      </TouchableOpacity>
      <IconButton
        icon="plus"
        size={30}
        onPress={handleUploadPress}
        style={styles.iconButton}
      />
      <TouchableOpacity onPress={() => navigateToScreen('NotificationScreen')}>
        <View>
          <Ionicons name="notifications" size={30} style={styles.icon} />
          {notificationCount > 0 && <Text style={styles.notificationCount}>{notificationCount}</Text>}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('ProfileScreen')}>
        <Ionicons name="person" size={30} style={styles.icon} />
      </TouchableOpacity>

      {/* Modal for unauthorized users */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              You are not authorized. You must be a business user or franchise user.
            </Text>
            <Button mode="contained" onPress={() => setModalVisible(false)}>
              OK
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50, // Adjust as needed
    backgroundColor: '#fff', // Change background color as per your design
    borderTopWidth: 1, // Optional: Add a border at the top
    borderTopColor: '#ccc', // Optional: Border color
  },
  icon: {
    color: 'gray', // Default color, change as per your design
  },
  iconButton: {
    backgroundColor: '#3498db', // Background color for the plus icon button
  },
  notificationCount: {
    position: 'absolute',
    top: -5,
    right: -20,
    backgroundColor: 'red',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default BottomNavbar;
