import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginResult, setLoginResult] = useState(null);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const handleLogin = async () => {
    console.log('hi')
    console.log(email)
    if (!email || !password) {
      return; // Return if email or password is empty
    }

    try {
      console.log('hiss')
      const response = await fetch('https://franchiseconnectt.up.railway.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Server response:', result);
  
        const userId = result.userId;
        if (userId !== undefined) {
          console.log('UserId from server:', userId);
  
          await AsyncStorage.setItem('userId', userId.toString());
          await AsyncStorage.setItem('token', result.token);
          await AsyncStorage.setItem('username', result.username);
          await AsyncStorage.setItem('user_type', result.user_type);
          
          // Check if user email equals to a specific email
          if (email === 'ranjitheggadi@gmail.com') {
            console.log('hi')
            // Navigate to a specific screen if email matches
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Admin' }],
              })
            );
          } else {
            // Navigate to a different screen if email does not match
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              })
            );
          }
  
          setLoginResult({ success: true, data: result });
        } else {
          console.warn('UserId is undefined in the server response');
        }
      } else {
        const errorResult = await response.json();
        console.error('Error response from server:', errorResult);
        setLoginResult({ success: false, error: errorResult.message });
        setIsErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setLoginResult({ success: false, error: 'An error occurred during login' });
      setIsErrorModalVisible(true);
    }
  };

  const handleRegisterPress = () => {
    navigation.dispatch(CommonActions.navigate('Registerscreen'));
  };

  const closeModal = () => {
    setIsErrorModalVisible(false);
    setLoginResult(null);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={false}
    >
      {loginResult && loginResult.success ? (
        <View style={styles.successContainer}>
          <LottieView
            source={require('../images/animations/hands.json')}
            autoPlay
            loop={false}
            style={styles.successAnimation}
            onAnimationFinish={() => {
              // Navigate to home screen after animation finishes
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                })
              );
            }}
          />
          <Text style={styles.successText}>Login Successful!</Text>
        </View>
      ) : (
        // Login form view
        <>
          <View>
            <Image source={require('../images/logo1.png')} style={styles.logo} />
            <Text style={styles.title}>Franchise Connect</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon name="mail-outline" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Enter your email"
                style={styles.input}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="lock-closed-outline" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Enter your password"
                secureTextEntry
                style={styles.input}
              />
            </View>
            <Button title="Login" onPress={handleLogin} disabled={!email || !password} style={styles.loginButton} />
            <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress}>
              <Text style={styles.textStyle}>Register</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Error modal */}
      <Modal
        isVisible={isErrorModalVisible}
        onBackdropPress={closeModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.5}
        backdropColor="#000"
        style={styles.modal}
      >
        {/* Error modal content */}
        <View style={styles.modalContent}>
          <LottieView
            source={require('../images/animations/invalid cred.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
          <Text style={styles.modalTitle}>Login Failed</Text>
          <Text style={styles.modalText}>
            {loginResult && loginResult.error ? loginResult.error : 'An unexpected error occurred.'}
          </Text>
          <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0', // Light peach background color
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#085f63',
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#555',
    fontSize: 16,
    paddingLeft: 5,
  },
  loginButton: {
    marginTop:
    10,
  },
  registerButton: {
    marginTop: 10,
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFF0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default LoginScreen;
