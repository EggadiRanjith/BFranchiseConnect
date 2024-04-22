import React, { useState, useEffect } from 'react';
import { ScrollView, Image, View, TextInput, Button, TouchableOpacity, StyleSheet, Platform, Modal, Text } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';

function FranchiseRegisterUser() {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [address, setAddress] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setErrorModalVisible(true);
          setErrorMessage('Permission to access media library denied');
        }
      }
    })();
  }, []);

  const selectProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setProfilePicture(result.uri);
      }
    } catch (error) {
      setErrorModalVisible(true);
      setErrorMessage('Error picking an image');
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateContactInfo = (contactInfo) => {
    return /^\d+$/.test(contactInfo);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegisterPress = async () => {
    try {
      if (!username || !email || !password || !contactInfo || !address) {
        setErrorMessage('All fields are required');
        setErrorModalVisible(true);
        return;
      }

      if (!validateEmail(email)) {
        setErrorMessage('Email should be in a valid format');
        setErrorModalVisible(true);
        return;
      }

      if (!validatePassword(password)) {
        setErrorMessage('Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number');
        setErrorModalVisible(true);
        return;
      }

      if (!validateContactInfo(contactInfo)) {
        setErrorMessage('Contact information should contain only numbers');
        setErrorModalVisible(true);
        return;
      }

      const user_type = 'user';

      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('contactInfo', contactInfo);
      formData.append('user_type', user_type);
      formData.append('address', address);

      if (profilePicture) {
        formData.append('profilePicture', {
          uri: profilePicture,
          name: 'profile.jpg',
          type: 'image/jpg',
        });
      }

      const response = await fetch('https://franchiseconnectt.up.railway.app/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        setRegistrationSuccess(true);
        navigation.dispatch(CommonActions.navigate('LoginScreen'));
      } else {
        setErrorModalVisible(true);
        setErrorMessage('Registration failed');
      }
    } catch (error) {
      setErrorModalVisible(true);
      setErrorMessage('Error during registration');
    }
  };

  const closeModal = () => {
    setErrorModalVisible(false);
    setErrorMessage('');
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {!registrationSuccess ? (
          <>
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={selectProfilePicture}>
                {profilePicture ? (
                  <Image source={{ uri: profilePicture }} style={styles.profileImage} />
                ) : (
                  <Image source={require('../images/default-profilepicture.png')} style={styles.profileImage} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="user" style={styles.inputIcon} />
              <TextInput
                placeholder="Your Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="envelope" style={styles.inputIcon} />
              <TextInput
                placeholder="Your Email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="lock" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="phone" style={styles.inputIcon} />
              <TextInput
                placeholder="Your Contact Information"
                style={styles.input}
                value={contactInfo}
                onChangeText={setContactInfo}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="map-marker-alt" style={styles.inputIcon} />
              <TextInput
                placeholder="Your Address"
                style={styles.input}
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <Button
              title=" Register"
              onPress={handleRegisterPress}
              disabled={!username || !email || !password || !contactInfo || !address}
            />
          </>
        ) : null}
      </ScrollView>

      <Modal
        visible={errorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <Button title="OK" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFAF0',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    paddingTop: 90,
  },
  profileContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
    fontSize: 20,
    color: '#555',
  },
  input: {
    flex: 1,
    height: 40,
    color: '#555',
    fontSize: 16,
    paddingLeft: 5,
  },
  successMessage: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
  },
});

export default FranchiseRegisterUser;
