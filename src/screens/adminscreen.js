import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AdminDashboardScreen = () => {
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://franchiseconnectt.up.railway.app/api/fetchadmindata');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setAdminData(data);
      setError(null); // Reset error if request is successful
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError('Failed to fetch data. Please try again.'); // Set error message
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const navigateToOtherScreen = () => {
    navigation.navigate('PendingBussiness'); // Navigating to the screen named 'OtherScreen'
  };

  const handleLogout = async () => {
    try {
      await clearUserData();
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('userId');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const renderUserSection = (title, total, agreed, pending) => (
    <View style={styles.userSection}>
      <Text style={styles.subSectionTitle}>{title}</Text>
      <View style={styles.section}>
        <FontAwesome5 name="building" style={styles.icon} />
        <View>
          <Text style={styles.sectionTitle}>Total</Text>
          <Text style={styles.sectionCount}>{total}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <FontAwesome5 name="check-circle" style={styles.icon} />
        <View>
          <Text style={styles.sectionTitle}>Agreed</Text>
          <Text style={styles.sectionCount}>{agreed}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <FontAwesome5 name="clock" style={styles.icon} />
        <View>
          <Text style={styles.sectionTitle}>Pending</Text>
          <Text style={styles.sectionCount}>{pending}</Text>
        </View>
      </View>
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Text style={styles.refreshButton}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!adminData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Franchise Connect</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <FontAwesome5 name="sign-out-alt" style={styles.logoutIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Admin Dashboard</Text>
        <View style={styles.content}>
          {/* Total Users */}
          <View style={styles.totalUsersContainer}>
            <FontAwesome5 name="users" style={styles.icon} />
            <View>
              <Text style={styles.sectionTitle}>Total Users</Text>
              <Text style={styles.sectionCount}>{adminData.totalUsersCount}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Business and Franchise Users */}
          <View style={styles.usersContainer}>
            {renderUserSection(
              'Business Users',
              adminData.businessUserCount,
              adminData.agreedBusinessUserCount,
              adminData.pendingBusinessUserCount
            )}
            {renderUserSection(
              'Franchise Users',
              adminData.franchiseUserCount,
              adminData.agreedFranchiseUserCount,
              adminData.pendingFranchiseUserCount
            )}
          </View>
          <View style={styles.divider} />

          {/* Total Businesses and Applications */}
          <View style={styles.usersContainer}>
            {renderUserSection(
              'Total Businesses',
              adminData.totalBusinessesCount,
              adminData.agreedBusinessesCount,
              adminData.pendingBusinessesCount
            )}
            {renderUserSection(
              'Total Applications',
              adminData.totalApplicationsCount,
              adminData.agreedApplicationsCount,
              adminData.pendingApplicationsCount
            )}
          </View>
          <View style={styles.divider} />

          {/* Button to view Business Applications */}
          <TouchableOpacity onPress={navigateToOtherScreen} style={styles.viewApplicationsButton}>
            <Text style={styles.viewApplicationsButtonText}>View Business Applications</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
        <FontAwesome5 name="sync" style={styles.refreshIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  title:{
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 8,
    textAlign:'center',

  },
  content: {
    flex: 1,
    padding: 20,
  },
  totalUsersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  usersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userSection: {
    flex: 1,
    marginRight: 10,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
    marginRight: 20,
    color: '#007bff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  sectionCount: {
    fontSize: 20,
    color: '#007bff',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#cccccc',
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems:
    'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  viewApplicationsButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  viewApplicationsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoutButton: {
    padding: 5,
  },
  logoutIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
});

export default AdminDashboardScreen;
