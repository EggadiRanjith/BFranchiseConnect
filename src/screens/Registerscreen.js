import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const FranchiseRegisterUser = () => {
  const navigation = useNavigation();

  const handleUserRegistrationPress = () => {
    navigation.dispatch(CommonActions.navigate('FranchiseRegisterUser'));
  };

  const handleCompanyRegistrationPress = () => {
    navigation.dispatch(CommonActions.navigate('CompanyRegister'));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../images/logo1.png')} style={styles.logo} />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.title}>Company Registration</Text>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleCompanyRegistrationPress}>
          <View style={styles.buttonContent}>
            <Icon name="person-add-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.modalButtonText]}>Register</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.title}>Franchise User Registration</Text>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleUserRegistrationPress}>
          <View style={styles.buttonContent}>
            <Icon name="business-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.modalButtonText]}>Register</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0', // Light peach background color
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  sectionContainer: {
    width: '80%',
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#085f63',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'San Francisco',
    marginBottom: 10,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2, // Add elevation for Android modal effect
    shadowColor: 'rgba(0, 0, 0, 0.1)', // Add shadow for iOS modal effect
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
    textAlign: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FranchiseRegisterUser;
